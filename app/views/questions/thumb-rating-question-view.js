import QuestionWithAnswersView from './base/question-with-answers-view.js';
import KEYS from 'views/helpers/keyboard-keys.js';
import Utils from './../../utils.js';

export default class ThumbRatingQuestionView extends QuestionWithAnswersView {
    /**
     * @param {SingleQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);

        this._currentAnswerIndex = null;
        this._thumbUpAnswerCode = '1';
        this._thumbDownAnswerCode = '0';

        this._thumbUpNode = this._getAnswerNode(this._thumbUpAnswerCode);
        this._thumbDownNode = this._getAnswerNode(this._thumbDownAnswerCode);

        this._attachHandlersToDOM();
    }

    get _currentAnswer() {
        return this.answers[this._currentAnswerIndex];
    }

    _attachHandlersToDOM() {
        this.answers.forEach((answer, index) => {
            this._getAnswerNode(answer.code)
                .on('click', this._onAnswerNodeClick.bind(this, answer))
                .on('focus', this._onAnswerNodeFocus.bind(this, index));
        });

        if (!this._settings.disableKeyboardSupport) {
            this._container.on('keydown', this._onKeyPress.bind(this));
        }
    }

    _selectAnswer(answer) {
        this._question.setValue(answer.code);
    }

    _selectAnswerNode(answer) {
        if (answer.code === this._thumbUpAnswerCode) {
            this._thumbUpNode.addClass('cf-thumb-rating__thumb-up--selected').attr('aria-pressed', 'true');
        } else {
            this._thumbDownNode.addClass('cf-thumb-rating__thumb-down--selected').attr('aria-pressed', 'true');
        }
    }

    _clearAnswersNode() {
        this._thumbUpNode.removeClass('cf-thumb-rating__thumb-up--selected').attr('aria-pressed', 'false');
        this._thumbDownNode.removeClass('cf-thumb-rating__thumb-down--selected').attr('aria-pressed', 'false');
    }

    _updateAnswerNodes({ value }) {
        if (value === undefined) {
            return;
        }

        this._clearAnswersNode();

        if (this._question.value === null) {
            return;
        }

        this._selectAnswerNode(this._question.getAnswer(this._question.value));
    }

    /**
     * @param {QuestionValidationResult} validationResult
     * @protected
     */
    _showErrors(validationResult) {
        super._showErrors(validationResult);
    }

    _hideErrors() {
        super._hideErrors();
    }

    _onModelValueChange({ changes }) {
        this._updateAnswerNodes(changes);
    }

    _onAnswerNodeClick(answer) {
        this._selectAnswer(answer);
    }

    _onAnswerNodeFocus(answerIndex) {
        this._currentAnswerIndex = answerIndex;
    }

    _onKeyPress(event) {
        this._onSelectKeyPress(event);
    }

    _onSelectKeyPress(event) {
        if ([KEYS.SpaceBar, KEYS.Enter].includes(event.keyCode) === false) {
            return;
        }
        if (Utils.isEmpty(this._currentAnswer)) {
            return;
        }

        event.preventDefault();

        this._selectAnswer(this._currentAnswer);
    }
}
