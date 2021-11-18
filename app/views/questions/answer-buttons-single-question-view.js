import SingleQuestionView from './single-question-view.js';
import StoredOtherValuesMixin from "./base/stored-other-values-mixin";
import {SingleOtherValuesKeeper} from "../helpers/other-values-keeper";

export default class AnswerButtonsSingleQuestionView extends SingleQuestionView {
    /**
     * @param {SingleQuestion} question
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

export class AnswerButtonsSingleQuestionViewWithStoredOtherValues extends StoredOtherValuesMixin(AnswerButtonsSingleQuestionView) {
    constructor(question, settings) {
        super(question, settings, new SingleOtherValuesKeeper(question, settings));
    }
}