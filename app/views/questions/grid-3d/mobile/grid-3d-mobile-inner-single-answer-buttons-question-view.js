import AnswerButtonsSingleQuestionView from "./../../answer-buttons-single-question-view";
import Grid3dMobileInnerQuestionViewMixin from "./grid-3d-mobile-inner-question-view-mixin";

export default class Grid3DMobileInnerSingleQuestionView extends Grid3dMobileInnerQuestionViewMixin(AnswerButtonsSingleQuestionView) {
    constructor(parentQuestion, question, settings = null) {
        super(parentQuestion, question, settings);
    }

    _onAnswerOtherNodeValueChange(answer, value) {
        super._onAnswerOtherNodeValueChange(answer, value);
        this._parentQuestion.setOtherValue(answer.code, value);
    }

    // eslint-disable-next-line no-unused-vars
    _isAnswerSelected(answer) {
        return this._question.value !== undefined && this._question.value === answer.code;
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