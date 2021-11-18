import MultiGridQuestionViewBase from "./multi-grid-question-view-base";
import MobileQuestionIdProvider from "../../helpers/mobile-question-id-provider";
import ValidationTypes from "../../../api/models/validation/validation-types";
import Utils from "../../../utils";

export default class MobileMultiGridQuestionView extends MultiGridQuestionViewBase {
    /**
     * @param {Grid3DQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings = null) {
        super(question, settings);
    }

    _createIdProvider(questionId) {
        return new MobileQuestionIdProvider(questionId);
    }

    _getQuestionGroupNode(questionId) {
        return this._mgHelper.getInnerQuestionNode(questionId).find('.cf-list');
    }

    _attachToDOM() {
        this._question.innerQuestions.forEach((question, questionIndex) => {
            question.answers.forEach((answer, answerIndex) => {
                this._mgHelper.getInnerQuestionAnswerNode(question.id, answer.code)
                    .on('click', this._onAnswerNodeClick.bind(this, question, answer));
                this._mgHelper.getInnerQuestionAnswerControlNode(question.id, answer.code)
                    .on('focus', this._onAnswerNodeFocus.bind(this, questionIndex, answerIndex));

                if (answer.isOther) {
                    this._mgHelper.getInnerQuestionAnswerOtherNode(question.id, answer.code)
                        .on('input', event => this._onAnswerOtherNodeValueChange(question, answer, event.target.value))
                        .on('click', e => e.stopPropagation())
                        .on('keydown', e => e.stopPropagation());
                }
            });
        });

        if (!this._settings.disableKeyboardSupport) {
            this._container.on('keydown', this._onKeyPress.bind(this));
        }
    }

    _setOtherNodeValue(answerCode, otherValue) {
        otherValue = otherValue || '';

        this._question.innerQuestions.forEach(question => {
            const input = this._mgHelper.getInnerQuestionAnswerOtherNode(question.id, answerCode);
            if(input.val() !== otherValue) {
                input.val(otherValue);
            }
        });
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
                const otherNode = this._mgHelper.getInnerQuestionAnswerOtherNode(question.id, result.answerCode);
                otherNode
                    .attr('aria-errormessage', errorBlockId)
                    .attr('aria-invalid', 'true');
                this._answerErrorBlockManager.showErrors(errorBlockId, otherNode, otherErrorsMessages);
            });
        });
    }

    _onAnswerOtherNodeValueChange(question, answer, value) {
        this._question.setOtherValue(answer.code, value);

        if (!this._isSelected(question, answer) && !Utils.isEmpty(value)) {
            this._selectAnswer(question, answer);
        }
    }
}