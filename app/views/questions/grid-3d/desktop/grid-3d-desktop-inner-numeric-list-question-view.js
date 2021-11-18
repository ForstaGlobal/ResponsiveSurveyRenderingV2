import Grid3DDesktopInnerQuestionView from "./grid-3d-desktop-inner-question-view";
import ErrorBlockManager from "../../../error/error-block-manager";
import MultiCountHelper from '../../../helpers/multi-count-helper';

export default class Grid3DDesktopInnerNumericListQuestionView extends Grid3DDesktopInnerQuestionView {
    constructor(parentQuestion, question, settings = null) {
        super(parentQuestion, question, settings);

        this._disabledAnswerClass = 'cf-grid-3d-desktop__numeric-control--disabled';

        this._answerErrorBlockManager = new ErrorBlockManager();

        this._attachHandlersToDOM();
    }

    _attachHandlersToDOM() {
        this._question.answers.forEach(answer => {
            this._getAnswerNode(answer.code).on('input', event => {
                this._onAnswerValueChangedHandler(answer.code, event.target.value);
            });
        });
    }

    _showErrors(validationResult) {
        validationResult.answerValidationResults.forEach(answerValidationResult => {
            const target = this._getAnswerNode(answerValidationResult.answerCode);
            const errorBlockId = this._getAnswerErrorBlockId(answerValidationResult.answerCode);
            const errors = answerValidationResult.errors.map(error => error.message);
            this._answerErrorBlockManager.showErrors(errorBlockId, target, errors);
        });
    }

    _hideErrors() {
        this._answerErrorBlockManager.removeAllErrors();
    }

    _updateAnswerNodes({values = []}) {
        if(values.length === 0)
            return;

        this._question.answers.forEach(answer => {
            const answerInput = this._getAnswerNode(answer.code);
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
                .filter((answer) => answer.isOther)
                .forEach((answer) => {
                    const answerOtherNode = this._getAnswerOtherNode(answer.code);
                    answerOtherNode.attr('disabled', isMaxMultiCountReached && !this._question.values[answer.code]);
                });
        }
    }

    _onAnswerValueChangedHandler(answerCode, answerValue) {
        this._question.setValue(answerCode, answerValue);
    }

    _onModelValueChange({changes}) {
        this._updateAnswerNodes(changes);

        if(this._question.autoSum){
            this._container.find(`#desktop_${this._question.id}_autosum`).text(this._question.totalSum);
        }
    }

    _onValidationComplete(validationResult) {
        this._hideErrors();
        if (validationResult.isValid === false) {
            this._showErrors(validationResult);
        }
    }
}