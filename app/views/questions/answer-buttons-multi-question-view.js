import MultiQuestionView from './multi-question-view.js';
import StoredOtherValuesMixin from "./base/stored-other-values-mixin";
import {MultiOtherValuesKeeper} from "../helpers/other-values-keeper";

export default class AnswerButtonsMultiQuestionView extends MultiQuestionView {
    /**
     * @param {MultiQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);
    }

    _getSelectedAnswerClass() {
        return  'cf-button-answer--selected';
    }

    _getSelectedControlClass() {
        return  'cf-button--selected';
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

export class AnswerButtonsMultiQuestionViewWithStoredOtherValues extends StoredOtherValuesMixin(AnswerButtonsMultiQuestionView) {
    constructor(question, settings) {
        super(question, settings, new MultiOtherValuesKeeper(question, settings));
    }
}