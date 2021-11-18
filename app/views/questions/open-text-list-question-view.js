import QuestionWithAnswersView from './base/question-with-answers-view.js';
import ValidationTypes from "../../api/models/validation/validation-types";
import MultiCountHelper from '../helpers/multi-count-helper';

export default class OpenTextListQuestionView extends QuestionWithAnswersView {
    constructor(question) {
        super(question);

        this._disabledAnswerClass = 'cf-open-list-answer--disabled';

        this._attachControlHandlers();
    }

    _onModelValueChange({changes}) {
        this._updateAnswerNodes(changes);
        this._updateAnswerOtherNodes(changes);
    }

    _updateAnswerNodes({values = []}) {
        if (values.length === 0)
            return;

        this._question.answers.forEach(answer => {
            const answerInput = this._getAnswerInputNode(answer.code);
            const value = this._question.values[answer.code] || '';
            if (answerInput.val() !== value) {
                answerInput.val(value);
            }

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
                this._onAnswerValueChangedHandler(answer.code, event.target.value);
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
            const answerNode = this._getAnswerInputNode(validationResult.answerCode);
            const errorBlockId = this._getAnswerErrorBlockId(validationResult.answerCode);
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

        this._container.find('.cf-text-box, .cf-text-area')
            .removeAttr('aria-errormessage')
            .removeAttr('aria-invalid');
    }

    _onAnswerValueChangedHandler(answerCode, answerValue) {
        this._question.setValue(answerCode, answerValue);
    }

    _onAnswerOtherNodeValueChange(answerCode, otherValue) {
        this._question.setOtherValue(answerCode, otherValue);
    }
}
