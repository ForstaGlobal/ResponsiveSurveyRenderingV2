import Grid3dMobileInnerQuestionViewMixin from "./grid-3d-mobile-inner-question-view-mixin";
import AnswerButtonsMultiQuestionView from "../../answer-buttons-multi-question-view";

export default class Grid3DMobileInnerMultiQuestionView extends Grid3dMobileInnerQuestionViewMixin(AnswerButtonsMultiQuestionView) {
    constructor(parentQuestion, question, settings = null) {
        super(parentQuestion, question, settings);
    }

    _isAnswerSelected(answer) {
        return this._isSelected(answer);
    }

    _onAnswerOtherNodeValueChange(answer, value) {
        super._onAnswerOtherNodeValueChange(answer, value);
        this._parentQuestion.setOtherValue(answer.code, value);
    }

    _onParentModelValidationComplete(validationResult) {
        this._parentAnswerErrorBlockManager.removeAllErrors();

        validationResult.answerValidationResults.forEach(answerValidationResult => {
            const answer = this._question.getAnswer(answerValidationResult.answerCode);
            if (!answer.isOther) {
                return;
            }

            if(!this._isAnswerSelected(answer)) {
                return;
            }

            const target = this._getAnswerNode(answerValidationResult.answerCode);
            const errorBlockId = this._getAnswerOtherErrorBlockId(answerValidationResult.answerCode);
            const errors = answerValidationResult.errors.map(error => error.message);
            this._parentAnswerErrorBlockManager.showErrors(errorBlockId, target, errors);
        });
    }
}