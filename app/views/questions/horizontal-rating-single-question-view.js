import QuestionWithAnswersView from './base/question-with-answers-view.js';
import KEYS from 'views/helpers/keyboard-keys.js';
import Utils from "../../utils";

export default class HorizontalRatingSingleQuestionView extends QuestionWithAnswersView {
    /**
     * @param {SingleRatingQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);

        this._groupNode = this._container.find('.cf-hrs-single');
        this._sortedAnswers = this._question.scaleItems.concat(this._question.nonScaleItems);

        this._currentAnswerIndex = null;

        this._attachHandlersToDOM();
    }

    get answers() {
        return this._sortedAnswers;
    }

    get _currentAnswer() {
        return this.answers[this._currentAnswerIndex];
    }

    _getSelectedControlClass(answerCode) {
        return this._isItemInScale(answerCode) ? "cf-horizontal-rating-item--selected" : "cf-radio--selected";
    }

    _getClickableAnswerNode(answerCode) {
        if(this._isItemInScale(answerCode)) {
            return this._getAnswerControlNode(answerCode);
        }
        return this._getAnswerNode(answerCode);
    }

    _attachHandlersToDOM() {
        this.answers.forEach((answer, index) => {
            this._getClickableAnswerNode(answer.code).on('click', this._onAnswerNodeClick.bind(this, answer));
            this._getAnswerControlNode(answer.code).on('focus', this._onAnswerControlNodeFocus.bind(this, index));
        });

        if (!this._settings.disableKeyboardSupport) {
            this._container.on('keydown', this._onKeyPress.bind(this));
        }
    }

    _isItemInScale(answerCode) {
        return this._question.scaleItems.find(item => item.code === answerCode) !== undefined;
    }

    _selectAnswer(answer) {
        this._question.setValue(answer.code);
    }

    _updateAnswerNodes() {
        this._question.answers.forEach(answer => {
            if(!this._isItemInScale(answer.code)) {
                this._clearAnswerNode(answer.code);
            }
            this._clearAnswerControlNode(answer.code);
        });

        const answerCode = this._question.value;
        if(answerCode === null) {
            this._getAnswerControlNode(this.answers[0].code).attr('tabindex', '0');
        } else {
            if(!this._isItemInScale(answerCode)) {
                this._selectAnswerNode(answerCode);
            }
            this._selectAnswerControlNode(answerCode);
        }
    }

    _clearAnswerNode(answerCode) {
        this._getAnswerNode(answerCode).removeClass('cf-radio-answer--selected')
    }

    _clearAnswerControlNode(answerCode) {
        this._getAnswerControlNode(answerCode)
            .removeClass(this._getSelectedControlClass(answerCode))
            .attr('aria-checked', 'false')
            .attr('tabindex', '-1')
            .css('background-color', '')
            .css('border-color', '');
    }

    _selectAnswerNode(answerCode) {
        this._getAnswerNode(answerCode).addClass('cf-radio-answer--selected');
    }

    _selectAnswerControlNode(answerCode) {
        const controlNode = this._getAnswerControlNode(answerCode);
        controlNode
            .addClass(this._getSelectedControlClass(answerCode))
            .attr('aria-checked', 'true')
            .attr('tabindex', '0');
        const answer = this._question.getAnswer(answerCode);
        if (answer.backgroundColor !== null) {
            controlNode.css({backgroundColor: answer.backgroundColor, borderColor: answer.backgroundColor});
        }
    }

    /**
     * @param {QuestionValidationResult} validationResult
     * @protected
     */
    _showErrors(validationResult) {
        super._showErrors(validationResult);
        this._groupNode.attr('aria-invalid', 'true');
    }

    _hideErrors() {
        super._hideErrors();
        this._groupNode.attr('aria-invalid', 'false');
    }

    _getPreviousAnswerIndex() {
        if (this._currentAnswerIndex > 0) {
            return this._currentAnswerIndex - 1;
        } else {
            return this.answers.length - 1;
        }
    }

    _getNextAnswerIndex() {
        if (this._currentAnswerIndex < this.answers.length - 1) {
            return this._currentAnswerIndex + 1;
        } else {
            return 0;
        }
    }

    _onModelValueChange({changes}) {
        this._updateAnswerNodes(changes);
    }

    _onAnswerNodeClick(answer) {
       this._selectAnswer(answer);
    }

    _onKeyPress(event) {
        this._onArrowKeyPress(event);
        this._onSelectKeyPress(event);
    }

    _onArrowKeyPress(event) {
        if ([KEYS.ArrowUp, KEYS.ArrowLeft, KEYS.ArrowRight, KEYS.ArrowDown].includes(event.keyCode) === false) {
            return;
        }
        if (this._currentAnswerIndex === null) {
            return;
        }

        event.preventDefault();

        let nextAnswer = null;
        switch (event.keyCode) {
            case KEYS.ArrowUp:
            case KEYS.ArrowLeft:
                nextAnswer = this.answers[this._getPreviousAnswerIndex()];
                break;
            case KEYS.ArrowRight:
            case KEYS.ArrowDown:
                nextAnswer = this.answers[this._getNextAnswerIndex()];
                break;
        }

        this._selectAnswer(nextAnswer);
        this._getAnswerControlNode(nextAnswer.code).focus();
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

    _onAnswerControlNodeFocus(answerIndex) {
        this._currentAnswerIndex = answerIndex;
    }
}