import QuestionWithAnswerView from "../base/question-with-answers-view";
import QuestionIdProvider from "../../helpers/question-id-provider";
import MultiGridQuestionHelper from "../../helpers/multi-grid-question-helper";
import KEYS from "../../helpers/keyboard-keys";
import Utils from "../../../utils";

export default class MultiGridQuestionViewBase extends QuestionWithAnswerView {
    /**
     * @param {Grid3DQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings = null) {
        super(question, settings);

        this._isAnswerButtons =  question.innerQuestions[0] !== undefined && question.innerQuestions[0].answerButtons || false;

        this._currentQuestionIndex = null;
        this._currentAnswerIndex = null;

        this._mgHelper = new MultiGridQuestionHelper(this._createIdProvider);

        this._attachToDOM();
    }

    _createIdProvider(questionId) {
        return new QuestionIdProvider(questionId);
    }

    get _currentQuestion() {
        return this._question.innerQuestions[this._currentQuestionIndex];
    }

    get _currentAnswer() {
        return this._question.answers[this._currentAnswerIndex];
    }

    /**
     * @param questionId
     * @private
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    _getQuestionGroupNode(questionId) {
        throw 'Not implemented';
    }

    _getSelectedAnswerClass(answer) {
        if (this._isAnswerButtons) {
            return 'cf-button-answer--selected';
        }
        if (answer.imagesSettings !== null) {
            return 'cf-image-answer--selected';
        }

        if (answer.isExclusive) {
            return 'cf-radio-answer--selected';
        }

        return 'cf-checkbox-answer--selected';
    }

    _getSelectedControlClass(answer) {
        if (this._isAnswerButtons) {
            return 'cf-button--selected';
        }
        if (answer.imagesSettings !== null) {
            return 'cf-image--selected';
        }

        if (answer.isExclusive) {
            return 'cf-radio--selected';
        }

        return 'cf-checkbox--selected';
    }

    _isSelected(question, answer) {
        return this._question.getInnerQuestion(question.id).values.includes(answer.code);
    }

    _toggleAnswer(question, answer) {
        if(this._isSelected(question, answer)) {
            this._unselectAnswer(question, answer);
        } else {
            this._selectAnswer(question, answer);
        }
    }

    _selectAnswer(question, answer) {
        this._question.getInnerQuestion(question.id).setValue(answer.code, true);
    }

    _unselectAnswer(question, answer) {
        this._question.getInnerQuestion(question.id).setValue(answer.code, false);
    }

    _updateQuestionAnswerNodes({questions = {}}) {
        Object.entries(questions).forEach(([questionId, {values = []}]) => {
            if (values.length === 0) {
                return;
            }

            values.forEach(value => {
                const answer = this._question.getAnswer(value);
                const isSelected = this._question.getInnerQuestion(questionId).values.includes(value);

                this._mgHelper.getInnerQuestionAnswerNode(questionId, value)
                    .toggleClass(this._getSelectedAnswerClass(answer), isSelected);

                const controlNode = this._mgHelper.getInnerQuestionAnswerControlNode(questionId, value);
                controlNode
                    .toggleClass(this._getSelectedControlClass(answer), isSelected)
                    .attr('aria-checked', isSelected ? 'true' : 'false');
                if (answer.backgroundColor !== null) {
                    if(isSelected) {
                        controlNode.css({backgroundColor: answer.backgroundColor, borderColor: answer.backgroundColor});
                    } else {
                        controlNode.css({backgroundColor: "", borderColor: ""});
                    }
                }
            });
        });
    }

    _showErrors(validationResult) {
        this._showInnerQuestionErrors(validationResult);
        this._showAnswerOtherError(validationResult);
    }

    _showInnerQuestionErrors(validationResult) {
        validationResult.questionValidationResults.filter(result => !result.isValid).forEach(validationResult => {
            const questionTextNode = this._mgHelper.getInnerQuestionTextNode(validationResult.questionId);
            const errorBlockId = this._mgHelper.getInnerQuestionErrorNodeId(validationResult.questionId);
            const errors = validationResult.errors.map(error => error.message);

            this._answerErrorBlockManager.showErrors(errorBlockId, questionTextNode, errors);
            this._getQuestionGroupNode(validationResult.questionId)
                .attr('aria-invalid', 'true')
                .attr('aria-errormessage', errorBlockId);
        });
    }

    _hideErrors() {
        this._answerErrorBlockManager.removeAllErrors();

        this._question.innerQuestions.forEach(innerQuestion => {
            this._getQuestionGroupNode(innerQuestion.id)
                .removeAttr('aria-invalid')
                .removeAttr('aria-errormessage');
        });

        this._container.find('.cf-text-box')
            .removeAttr('aria-errormessage')
            .removeAttr('aria-invalid');
    }

    _onModelValueChange({changes}) {
        this._updateQuestionAnswerNodes(changes);
        this._updateAnswerOtherNodes(changes);
    }

    _onAnswerNodeClick(question, answer) {
        this._toggleAnswer(question, answer);
    }

    _onAnswerNodeFocus(questionIndex, answerIndex) {
        this._currentQuestionIndex = questionIndex;
        this._currentAnswerIndex = answerIndex;
    }

    _onAnswerOtherNodeValueChange(answer, value) {
        this._question.setOtherValue(answer.code, value);
    }

    _onKeyPress(event) {
        this._onSelectKeyPress(event);
    }

    _onSelectKeyPress(event) {
        if ([KEYS.SpaceBar, KEYS.Enter].includes(event.keyCode) === false) {
            return;
        }
        if (Utils.isEmpty(this._currentQuestion) || Utils.isEmpty(this._currentAnswer)) {
            return;
        }

        event.preventDefault();

        this._toggleAnswer(this._currentQuestion, this._currentAnswer);
    }
}