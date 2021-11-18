import MobileMultiGridQuestionView from "./mobile-multi-grid-question-view";
import ValidationTypes from "../../../api/models/validation/validation-types";

export default class MobileAnswerButtonsMultiGridQuestionView extends MobileMultiGridQuestionView {
    /**
     * @param {Grid3DQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings = null) {
        super(question, settings);
    }

    _showAnswerOtherError(validationResult) {
        validationResult.answerValidationResults.filter(result => !result.isValid).forEach(result => {
            const otherErrorsMessages = result.errors
                .filter(error => error.type === ValidationTypes.OtherRequired)
                .map(error => error.message);

            if (otherErrorsMessages.length === 0) {
                return;
            }

            this._question.innerQuestions.forEach(question => {
                if (!question.values.includes(result.answerCode)) {
                    return;
                }

                const errorBlockId = this._mgHelper.getInnerQuestionAnswerOtherErrorBlockId(question.id, result.answerCode);
                const textNode = this._mgHelper.getInnerQuestionAnswerTextNode(question.id, result.answerCode);
                this._answerErrorBlockManager.showErrors(errorBlockId, textNode, otherErrorsMessages);

                const otherNode = this._mgHelper.getInnerQuestionAnswerOtherNode(question.id, result.answerCode);
                otherNode
                    .addClass('cf-text-box--error')
                    .addClass('cf-button-answer__other--error')
                    .attr('aria-errormessage', errorBlockId)
                    .attr('aria-invalid', 'true');
            });
        });
    }

    _hideErrors() {
        super._hideErrors();

        this._container.find('.cf-text-box')
            .removeClass('cf-text-box--error')
            .removeClass('cf-button-answer__other--error');
    }
}