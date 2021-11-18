import QuestionWithAnswersView from './base/question-with-answers-view.js';
import KEYS from 'views/helpers/keyboard-keys.js';
import Utils from './../../utils.js';
import ValidationTypes from '../../api/models/validation/validation-types';
import CollapsibleGroup from '../controls/collapsible-group';
import GroupTypes from '../../api/group-types';
import StoredOtherValuesMixin from './base/stored-other-values-mixin';
import { SingleOtherValuesKeeper } from '../helpers/other-values-keeper';

export default class SingleQuestionView extends QuestionWithAnswersView {
    /**
     * @param {SingleQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);

        this._groupNode = this._container.find('.cf-list');
        this._currentAnswerIndex = null;
        this._collapsibleGroups = this._createCollapsibleGroups();

        this._attachHandlersToDOM();
    }

    get _currentAnswer() {
        return this.answers[this._currentAnswerIndex];
    }

    _createCollapsibleGroups() {
        const prepareCollapsibleGroupShortInfo = (question, group) => {
            const answer = question.getAnswer(question.value);
            return group.items.includes(answer)
                ? [answer.isOther ? question.otherValues[question.value] : answer.text]
                : [];
        };

        return this._question.answerGroups
            .filter((group) => group.type === GroupTypes.Collapsible)
            .map((group) => new CollapsibleGroup(this._question, group, prepareCollapsibleGroupShortInfo));
    }

    _attachHandlersToDOM() {
        this.answers.forEach((answer, index) => {
            this._getAnswerNode(answer.code).on('click', this._onAnswerNodeClick.bind(this, answer));
            this._getAnswerControlNode(answer.code).on('focus', this._onAnswerNodeFocus.bind(this, index));

            if (answer.isOther) {
                const otherInput = this._getAnswerOtherNode(answer.code);
                otherInput.on('click', (e) => e.stopPropagation());
                otherInput.on('keydown', (e) => e.stopPropagation());
                otherInput.on('input', (e) => this._onAnswerOtherNodeValueChange(answer, e.target.value));
            }
        });

        if (!this._settings.disableKeyboardSupport) {
            this._container.on('keydown', this._onKeyPress.bind(this));
        }
    }

    _selectAnswer(answer) {
        this._question.setValue(answer.code);

        if (answer.isOther) {
            const otherInput = this._getAnswerOtherNode(answer.code);
            if (Utils.isEmpty(otherInput.val())) {
                otherInput.focus();
            }
        }
    }

    _selectAnswerNode(answer) {
        this._getAnswerNode(answer.code).addClass(this._getSelectedAnswerClass(answer));
        const controlNode = this._getAnswerControlNode(answer.code);

        controlNode.addClass(this._getSelectedControlClass(answer)).attr('aria-checked', 'true').attr('tabindex', '0');

        if (answer.backgroundColor !== null) {
            controlNode.css({ backgroundColor: answer.backgroundColor, borderColor: answer.backgroundColor });
        }
    }

    _clearAnswerNode(answer) {
        this._getAnswerNode(answer.code).removeClass(this._getSelectedAnswerClass(answer));
        this._getAnswerControlNode(answer.code)
            .removeClass(this._getSelectedControlClass(answer))
            .attr('aria-checked', 'false')
            .attr('tabindex', '-1')
            .css('background-color', '')
            .css('border-color', '');
    }

    _updateAnswerNodes({ value }) {
        if (value === undefined) {
            return;
        }

        this._question.answers.forEach((answer) => {
            this._clearAnswerNode(answer);
        });

        if (this._question.value === null) {
            this._getAnswerControlNode(this._question.answers[0].code).attr('tabindex', '0');
            return;
        }

        this._selectAnswerNode(this._question.getAnswer(this._question.value));
    }

    _getSelectedAnswerClass(answer) {
        return answer.imagesSettings !== null ? 'cf-image-answer--selected' : 'cf-radio-answer--selected';
    }

    _getSelectedControlClass(answer) {
        return answer.imagesSettings !== null ? 'cf-image--selected' : 'cf-radio--selected';
    }

    _updateAnswerOtherNodes(changes) {
        this._question.answers
            .filter((answer) => answer.isOther)
            .forEach((answer) => {
                const selected = this._question.value === answer.code;
                this._getAnswerOtherNode(answer.code)
                    .attr('tabindex', selected ? '0' : '-1')
                    .attr('aria-hidden', selected ? 'false' : 'true');
            });

        super._updateAnswerOtherNodes(changes);
    }

    /**
     * @param {QuestionValidationResult} validationResult
     * @protected
     */
    _showErrors(validationResult) {
        super._showErrors(validationResult);
        this._updateRadioGroupAriaInvalidState(validationResult);
    }

    /**
     * @param {AnswerValidationResult} validationResult
     * @protected
     */
    _showAnswerError(validationResult) {
        super._showAnswerError(validationResult);
        this._addAriaValidationAttributesToAnswerOther(validationResult);
    }

    /**
     * @param {AnswerValidationResult} validationResult
     * @protected
     */
    _addAriaValidationAttributesToAnswerOther(validationResult) {
        const otherErrors = validationResult.errors.filter((error) => error.type === ValidationTypes.OtherRequired);
        if (otherErrors.length === 0) {
            return;
        }

        const errorBlockId = this._getAnswerErrorBlockId(validationResult.answerCode);
        const otherNode = this._getAnswerOtherNode(validationResult.answerCode);
        otherNode.attr('aria-errormessage', errorBlockId).attr('aria-invalid', 'true');
    }

    _updateRadioGroupAriaInvalidState(validationResult) {
        const hasNotOnlyOtherErrors =
            validationResult.errors.length > 0 ||
            validationResult.answerValidationResults
                .filter((result) => result.isValid === false)
                .some((result) => result.errors.some((error) => error.type !== ValidationTypes.OtherRequired));
        if (hasNotOnlyOtherErrors === false) {
            return;
        }

        this._groupNode.attr('aria-invalid', 'true');
    }

    _hideErrors() {
        super._hideErrors();

        this._groupNode.attr('aria-invalid', 'false');

        this._question.answers
            .filter((answer) => answer.isOther)
            .forEach((answer) => {
                this._getAnswerOtherNode(answer.code).removeAttr('aria-errormessage').removeAttr('aria-invalid');
            });
    }

    _onModelValueChange({ changes }) {
        this._updateAnswerNodes(changes);
        this._updateAnswerOtherNodes(changes);
    }

    _onAnswerNodeClick(answer) {
        this._getAnswerControlNode(answer.code).focus();
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
                if (this._currentAnswerIndex > 0) {
                    nextAnswer = this.answers[this._currentAnswerIndex - 1];
                } else {
                    nextAnswer = this.answers[this.answers.length - 1];
                }
                break;
            case KEYS.ArrowRight:
            case KEYS.ArrowDown:
                if (this._currentAnswerIndex < this.answers.length - 1) {
                    nextAnswer = this.answers[this._currentAnswerIndex + 1];
                } else {
                    nextAnswer = this.answers[0];
                }
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

    _onAnswerNodeFocus(answerIndex) {
        this._currentAnswerIndex = answerIndex;
    }

    _onAnswerOtherNodeValueChange(answer, otherValue) {
        if (!Utils.isEmpty(otherValue)) {
            this._question.setValue(answer.code);
        }

        if (this._question.value === answer.code) {
            this._question.setOtherValue(answer.code, otherValue);
        }
    }
}

export class SingleQuestionViewWithStoredOtherValues extends StoredOtherValuesMixin(SingleQuestionView) {
    constructor(question, settings) {
        super(question, settings, new SingleOtherValuesKeeper(question, settings));
    }
}
