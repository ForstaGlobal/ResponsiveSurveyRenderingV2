import QuestionWithAnswersView from './base/question-with-answers-view';
import ValidationTypes from '../../api/models/validation/validation-types';
import MultiCountHelper from '../helpers/multi-count-helper';
import Utils from '../../utils';

export default class RankByNumberQuestionView extends QuestionWithAnswersView {
    constructor(question, settings) {
        super(question, settings);
        this._nanCode = 'NOT_A_NUMBER';
        this._disabledAnswerClass = 'cf-rank-by-number-answer--disabled';

        this._attachControlHandlers();
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

    _showErrors(validationResult) {
        super._showErrors(validationResult);

        // Linking all ranking inputs to question level errors.
        if (validationResult.errors.length > 0) {
            this._question.answers.forEach(answer => {
                const inputNode = this._getAnswerInputNode(answer.code);
                inputNode.attr('aria-describedby', this._getQuestionErrorNodeId());
            });
        }
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

            const inputNode = this._getAnswerInputNode(validationResult.answerCode);
            inputNode.attr('aria-errormessage', errorBlockId).attr('aria-invalid', 'true');
            inputNode.addClass('cf-text-box--error');

            const answer = this._question.getAnswer(validationResult.answerCode);
            const targetNode = answer.isOther
                ? this._getAnswerOtherNode(validationResult.answerCode)
                : this._getAnswerTextNode(validationResult.answerCode);
            this._answerErrorBlockManager.showErrors(errorBlockId, targetNode, answerErrors);
        }

        if (otherErrors.length > 0) {
            const otherNode = this._getAnswerOtherNode(validationResult.answerCode);
            const otherErrorBlockId = this._getAnswerOtherErrorBlockId(validationResult.answerCode);
            otherNode.attr('aria-errormessage', otherErrorBlockId).attr('aria-invalid', 'true');
            this._answerErrorBlockManager.showErrors(otherErrorBlockId, otherNode, otherErrors);
        }
    }

    _hideErrors() {
        super._hideErrors();

        this._question.answers.forEach(answer => {
            if (answer.isOther) {
                this._getAnswerOtherNode(answer.code).removeAttr('aria-errormessage').removeAttr('aria-invalid');
            }
            this._getAnswerInputNode(answer.code)
                .removeAttr('aria-errormessage')
                .removeAttr('aria-invalid')
                .removeAttr('aria-describedby') // remove reference to question level error
                .removeClass('cf-text-box--error');
        });
    }

    _updateAnswerNodes({ values = [] }) {
        if (values.length === 0) {
            return;
        }

        this._question.answers.forEach(answer => {
            const value = this._question.values[answer.code];
            const answerInput = this._getAnswerInputNode(answer.code);

            if (MultiCountHelper.isMultiCountSet(this._question.multiCount)) {
                const answerNode = this._getAnswerNode(answer.code);
                const isMaxMultiCountReached = MultiCountHelper.isMaxMultiCountReached(
                    Object.values(this._question.values).length,
                    this._question.multiCount
                );
                if (isMaxMultiCountReached && Utils.isEmpty(value)) {
                    answerNode.addClass(this._disabledAnswerClass);
                } else {
                    answerNode.removeClass(this._disabledAnswerClass);
                }

                answerInput.attr('disabled', isMaxMultiCountReached && Utils.isEmpty(value));
            }

            if (value === this._nanCode) {
                return;
            }
            if (answerInput.val() === value) {
                return;
            }
            answerInput.val(value);
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

    _onModelValueChange({ changes }) {
        this._updateAnswerNodes(changes);
        this._updateAnswerOtherNodes(changes);
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
