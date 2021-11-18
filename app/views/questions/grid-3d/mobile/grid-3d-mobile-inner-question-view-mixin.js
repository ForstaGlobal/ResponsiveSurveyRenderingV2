import ErrorBlockManager from "../../../error/error-block-manager";
import MobileQuestionIdProvider from "../../../helpers/mobile-question-id-provider";
import ValidationTypes from "../../../../api/models/validation/validation-types";

const Grid3DMobileInnerQuestionViewMixin = base => class extends base {
    constructor(parentQuestion, question, settings = null) {
        super(question, settings);

        this._parentQuestion = parentQuestion;
        this._parentAnswerErrorBlockManager = new ErrorBlockManager();

        this._onParentModelValueChange = this._onParentModelValueChange.bind(this);
        this._onParentModelValidationComplete = this._onParentModelValidationComplete.bind(this);

        this._attachParentModelHandlers();
    }

    _createIdProvider(questionId) {
        return new MobileQuestionIdProvider(questionId);
    }

    detach() {
        super.detach();
        this._detachParentModelHandlers();
    }

    _attachParentModelHandlers() {
        this._parentQuestion.changeEvent.on(this._onParentModelValueChange);
        this._parentQuestion.validationCompleteEvent.on(this._onParentModelValidationComplete);
    }

    _detachParentModelHandlers() {
        this._parentQuestion.changeEvent.off(this._onParentModelValueChange);
        this._parentQuestion.validationCompleteEvent.off(this._onParentModelValidationComplete);
    }

    /**
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    _isAnswerSelected(answer) {
    }

    _onParentModelValueChange({changes}) {
        if (changes.otherValues === undefined) {
            return;
        }

        changes.otherValues.forEach(answerCode => {
            const otherValue = this._parentQuestion.otherValues[answerCode];
            this._setOtherNodeValue(answerCode, otherValue);
        });
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

            const target = this._getAnswerOtherNode(answerValidationResult.answerCode);
            const errorBlockId = this._getAnswerErrorBlockId(answerValidationResult.answerCode);
            const errors = answerValidationResult.errors.map(error => error.message);
            this._parentAnswerErrorBlockManager.showErrors(errorBlockId, target, errors);

            const otherErrors = answerValidationResult.errors.filter(error => error.type === ValidationTypes.OtherRequired);
            if (otherErrors.length > 0) {
                this._getAnswerOtherNode(answerValidationResult.answerCode)
                    .attr('aria-errormessage', errorBlockId)
                    .attr('aria-invalid', 'true');
            }
        });
    }
};
export default Grid3DMobileInnerQuestionViewMixin;