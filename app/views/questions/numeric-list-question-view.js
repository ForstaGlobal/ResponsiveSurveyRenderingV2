import QuestionWithAnswersView from './base/question-with-answers-view.js';
import ValidationTypes from "../../api/models/validation/validation-types";
import MultiCountHelper from '../helpers/multi-count-helper';

export default class NumericListQuestionView extends QuestionWithAnswersView {
    constructor(question) {
        super(question);

        this._nanCode = 'NOT_A_NUMBER';
        this._disabledAnswerClass = 'cf-numeric-list-answer--disabled';

        this._attachControlHandlers();

    }

    _updateAnswerNodes({values = []}) {
        if (values.length === 0)
            return;

        this._question.answers.forEach(answer => {
            const answerInput = this._getAnswerInputNode(answer.code);
            const value = this._question.values[answer.code];
            if (value === this._nanCode) {
                return;
            }
            if (answerInput.val() === value) {
                return;
            }
            answerInput.val(value);

            if (MultiCountHelper.isMultiCountSet(this._question.multiCount)) {
                const answerNode = this._getAnswerNode(answer.code);
                const isMaxMultiCountReached = MultiCountHelper.isMaxMultiCountReached(
                    Object.values(this._question.values).length,
                    this._question.multiCount
                );
                if (isMaxMultiCountReached && !value) {
                    answerNode.addClass(this._disabledAnswerClass);
                    answerInput.attr('disabled', true);
                } else {
                    answerNode.removeClass(this._disabledAnswerClass);
                    answerInput.attr('disabled', false);
                }
            }
        });
    }

    _updateAnswerOtherNodes(changes) {
        super._updateAnswerOtherNodes(changes);

        if (MultiCountHelper.isMultiCountSet(this._question.multiCount)) {
            const isMaxMultiCountReached = MultiCountHelper.isMaxMultiCountReached(
                Object.values(this._question.values).length,
                this._question.multiCount
            );
            this._question.answers
                .filter(answer => answer.isOther)
                .forEach(answer => {
                    const answerOtherNode = this._getAnswerOtherNode(answer.code);
                    answerOtherNode.attr('disabled', isMaxMultiCountReached && !this._question.values[answer.code]);
                });
        }
    }

    _attachControlHandlers() {
        this.answers.forEach(answer => {
            this._getAnswerInputNode(answer.code).on('input', event => {
                this._onAnswerValueChangedHandler(answer.code, event);
            });

            if (answer.isOther) {
                this._getAnswerOtherNode(answer.code).on('input', event => {
                    this._onAnswerOtherNodeValueChange(answer.code, event.target.value);
                });
            }
        });
    }

    _showAnswerError(validationResult) {
        const answerErrors = [];
        const otherErrors = [];
        validationResult.errors.forEach(error => {
            if (error.type === ValidationTypes.OtherRequired) {
                otherErrors.push(error.message);
            } else {
                answerErrors.push(error.message);
            }
        });

        if (answerErrors.length > 0) {
            const errorBlockId = this._getAnswerErrorBlockId(validationResult.answerCode);
            const answerNode = this._getAnswerInputNode(validationResult.answerCode);
            answerNode
                .attr('aria-errormessage', errorBlockId)
                .attr('aria-invalid', 'true');
            this._answerErrorBlockManager.showErrors(errorBlockId, answerNode, answerErrors);
        }

        if (otherErrors.length > 0) {
            const otherNode = this._getAnswerOtherNode(validationResult.answerCode);
            const otherErrorBlockId = this._getAnswerOtherErrorBlockId(validationResult.answerCode);
            otherNode
                .attr('aria-errormessage', otherErrorBlockId)
                .attr('aria-invalid', 'true');
            this._answerErrorBlockManager.showErrors(otherErrorBlockId, otherNode, otherErrors);
        }
    }

    _hideErrors() {
        super._hideErrors();

        this._container.find('.cf-text-box')
            .removeAttr('aria-errormessage')
            .removeAttr('aria-invalid');
    }

    _onModelValueChange({changes}) {
        this._updateAnswerNodes(changes);
        this._updateAnswerOtherNodes(changes);

        if (this._question.autoSum) {
            this._container.find('.cf-numeric-list-auto-sum__value').text(this._question.totalSum);
        }
    }

    _onAnswerValueChangedHandler(answerCode, event) {
        let value = event.target.value;
        if (value === '' && !event.target.validity.valid) {
            value = this._nanCode;
        }
        this._question.setValue(answerCode, value);
    }

    _onAnswerOtherNodeValueChange(answerCode, otherValue) {
        this._question.setOtherValue(answerCode, otherValue);
    }
}
