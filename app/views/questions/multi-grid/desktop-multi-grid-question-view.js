import MultiGridQuestionViewBase from "./multi-grid-question-view-base";
import DesktopQuestionIdProvider from "../../helpers/desktop-question-id-provider";
import ValidationTypes from "../../../api/models/validation/validation-types";

export default class DesktopMultiGridQuestionView extends MultiGridQuestionViewBase {
    /**
     * @param {Grid3DQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings = null) {
        super(question, settings);
    }

    _createIdProvider(questionId) {
        return new DesktopQuestionIdProvider(questionId);
    }

    _getQuestionGroupNode(questionId) {
        return this._mgHelper.getInnerQuestionNode(questionId);
    }

    _attachToDOM() {
        this._question.innerQuestions.forEach((question, questionIndex) => {
            question.answers.forEach((answer, answerIndex) => {
                this._mgHelper.getInnerQuestionAnswerNode(question.id, answer.code)
                    .on('click', this._onAnswerNodeClick.bind(this, question, answer));
                this._mgHelper.getInnerQuestionAnswerControlNode(question.id, answer.code)
                    .on('focus', this._onAnswerNodeFocus.bind(this, questionIndex, answerIndex));
            });
        });

        this._question.answers.filter(answer => answer.isOther).forEach(answer => {
            this._getAnswerOtherNode(answer.code)
                .on('input', event => this._onAnswerOtherNodeValueChange(answer, event.target.value))
                .on('click', e => e.stopPropagation())
                .on('keydown', e => e.stopPropagation());
        });

        if (!this._settings.disableKeyboardSupport) {
            this._container.on('keydown', this._onKeyPress.bind(this));
        }
    }

    _showAnswerOtherError(validationResult) {
        validationResult.answerValidationResults.filter(result => !result.isValid).forEach(result => {
            const otherErrorsMessages = result.errors
                .filter(error => error.type === ValidationTypes.OtherRequired)
                .map(error => error.message);

            if (otherErrorsMessages.length === 0) {
                return;
            }

            const errorBlockId = this._getAnswerOtherErrorBlockId(result.answerCode);
            const otherNode = this._getAnswerOtherNode(result.answerCode);
            otherNode
                .attr('aria-errormessage', errorBlockId)
                .attr('aria-invalid', 'true');

            this._answerErrorBlockManager.showErrors(errorBlockId, otherNode, otherErrorsMessages);
        });
    }
}