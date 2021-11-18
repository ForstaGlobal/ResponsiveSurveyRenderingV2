import CaptureOrderMultiQuestionView from './capture-order-multi-question-view';
import StoredOtherValuesMixin from "./base/stored-other-values-mixin";
import {RankingOtherValuesKeeper} from "../helpers/other-values-keeper";

export default class AnswerButtonsCaptureOrderMultiQuestionView extends CaptureOrderMultiQuestionView {
    /**
     * @param {RankingQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);
    }

    _getSelectedAnswerClass() {
        return 'cf-button-answer--selected';
    }

    _getSelectedControlClass() {
        return 'cf-button--selected';
    }

    _showAnswerError(validationResult) {
        if (this._settings.isAccessible) {
            super._showAnswerError(validationResult);
            return;
        }

        const answerNode = this._getAnswerNode(validationResult.answerCode);
        const errorBlockId = this._getAnswerErrorBlockId(validationResult.answerCode);
        const errors = validationResult.errors.map(error => error.message);
        this._answerErrorBlockManager.showErrors(errorBlockId, answerNode, errors);

        this._addAriaValidationAttributesToAnswerOther(validationResult);
    }
}

export class AnswerButtonsCaptureOrderMultiQuestionViewWithStoredOtherValues extends StoredOtherValuesMixin(AnswerButtonsCaptureOrderMultiQuestionView) {
    constructor(question, settings) {
        super(question, settings, new RankingOtherValuesKeeper(question, settings));
    }
}