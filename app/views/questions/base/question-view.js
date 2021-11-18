import QuestionErrorBlock from '../../error/question-error-block.js';
import QuestionViewBase from "./question-view-base";
import $ from 'jquery';
import QuestionIdProvider from "../../helpers/question-id-provider";

export default class QuestionView extends QuestionViewBase {
    /**
     * @param {Question} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings = null) {
        super(question, settings);

        this._idProvider = this._createIdProvider(this._question.id);
        this._questionContainer = this._getQuestionNode();
        this._container = this._getQuestionContentNode();
        this._questionErrorBlock = this._createQuestionErrorBlock();
    }

    _createIdProvider(questionId) {
        return new QuestionIdProvider(questionId);
    }

    _createQuestionErrorBlock() {
        return new QuestionErrorBlock(this._getQuestionErrorNode());
    }

    _getQuestionErrorNodeId() {
        return this._idProvider.getQuestionErrorNodeId();
    }

    _getQuestionInputNodeId() {
        return this._idProvider.getQuestionInputNodeId();
    }

    _getQuestionNode() {
        return $('#' + this._idProvider.getQuestionNodeId());
    }

    _getQuestionErrorNode() {
        return $('#' + this._getQuestionErrorNodeId());
    }

    _getQuestionInputNode() {
        return $('#' + this._getQuestionInputNodeId());
    }

    _getQuestionContentNode() {
        return $('#' + this._idProvider.getQuestionContentNodeId());
    }


    _onValidationComplete(validationResult) {
        this._hideErrors();

        if (validationResult.isValid === false) {
            this._showErrors(validationResult);
        }
    }

    _showErrors(validationResult) {
        this._addQuestionErrorModifier();
        this._questionErrorBlock.showErrors(validationResult.errors.map(error => error.message));
    }

    _hideErrors() {
        this._removeQuestionErrorModifier();
        this._questionErrorBlock.hideErrors();
    }

    _addQuestionErrorModifier() {
        this._questionContainer.addClass('cf-question--error');
    }

    _removeQuestionErrorModifier() {
        this._questionContainer.removeClass('cf-question--error');
    }
}
