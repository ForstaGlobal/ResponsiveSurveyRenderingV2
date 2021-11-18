import QuestionWithAnswersView from './base/question-with-answers-view.js';
import Utils from './../../utils.js';
import KEYS from '../helpers/keyboard-keys';
import ValidationTypes from '../../api/models/validation/validation-types';
import MultiCountHelper from '../helpers/multi-count-helper';
import StoredOtherValuesMixin from "./base/stored-other-values-mixin";
import {RankingOtherValuesKeeper} from "../helpers/other-values-keeper";

export default class RankingQuestionView extends QuestionWithAnswersView {
    /**
     * @param {RankingQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);

        this._selectedAnswerClass = 'cf-ranking-answer--selected';
        this._disabledAnswerClass = 'cf-ranking-answer--disabled';
        this._currentAnswerIndex = null;

        this._rankingStatusNode = this._container.find('.cf-ranking-status');

        this._attachHandlersToDOM();
    }

    _getAnswerRankNode(code) {
        return this._getAnswerNode(code).find('.cf-ranking-answer__rank');
    }

    get _currentAnswer() {
        return this.answers[this._currentAnswerIndex];
    }

    /**
     * @param {AnswerValidationResult} validationResult
     * @private
     */
    _showAnswerError(validationResult) {
        if (this._settings.isAccessible) {
            this._showAccessibleError(validationResult);
            return;
        }

        const target = this._getAnswerNode(validationResult.answerCode);
        const errorBlockId = this._getAnswerErrorBlockId(validationResult.answerCode);
        const errors = validationResult.errors.map(error => error.message);
        this._answerErrorBlockManager.showErrors(errorBlockId, target, errors);

        const otherErrors = validationResult.errors.filter(error => error.type === ValidationTypes.OtherRequired);
        if (otherErrors.length > 0) {
            this._getAnswerOtherNode(validationResult.answerCode)
                .attr('aria-errormessage', errorBlockId)
                .attr('aria-invalid', 'true');
        }
    }

    _showAccessibleError(validationResult) {
        const answerErrors = [];
        const otherErrors = [];
        validationResult.errors.forEach(error => {
            if (error.type === ValidationTypes.OtherRequired) {
                otherErrors.push(error.message);
            } else {
                answerErrors.push(error.message);
            }
        });

        if (answerErrors.length > 0) {
            const answerNode = this._getAnswerNode(validationResult.answerCode);
            const errorBlockId = this._getAnswerErrorBlockId(validationResult.answerCode);
            this._answerErrorBlockManager.showErrors(errorBlockId, answerNode, answerErrors);
        }

        if (otherErrors.length > 0) {
            const otherNode = this._getAnswerOtherNode(validationResult.answerCode);
            const otherErrorBlockId = this._getAnswerOtherErrorBlockId(validationResult.answerCode);
            otherNode
                .attr('aria-errormessage', otherErrorBlockId)
                .attr('aria-invalid', 'true');
            this._answerErrorBlockManager.showErrors(otherErrorBlockId, otherNode, otherErrors);
        }
    }

    _hideErrors() {
        super._hideErrors();
        this._question.answers.filter(answer => answer.isOther).forEach(answer => {
            this._getAnswerOtherNode(answer.code)
                .removeAttr('aria-errormessage')
                .removeAttr('aria-invalid');
        });
    }

    _updateAnswerNodes({values = []}) {
        if (values.length === 0)
            return;

        this._question.answers.forEach(answer => {
            const answerNode = this._getAnswerNode(answer.code);
            answerNode
                .removeClass(this._selectedAnswerClass)
                .removeClass(this._disabledAnswerClass)
                .attr('aria-pressed', 'false')
                .css('color', '')
                .css('background-color', '')
                .css('border-color', '');

            if (MultiCountHelper.isMaxMultiCountReached(Object.values(this._question.values).length, this._question.multiCount)) {
                answerNode.addClass(this._disabledAnswerClass);
            }

            this._getAnswerRankNode(answer.code).text('-');
        });

        Object.entries(this._question.values).forEach(([code, value]) => {
            const answer = this._question.getAnswer(code);
            const answerNode = this._getAnswerNode(code);
            answerNode
                .addClass(this._selectedAnswerClass)
                .removeClass(this._disabledAnswerClass)
                .attr('aria-pressed', 'true');
            if (!Utils.isEmpty(answer.backgroundColor)) {
                answerNode.css({
                    color: answer.backgroundColor,
                    backgroundColor: answer.backgroundColor,
                    borderColor: answer.backgroundColor
                });
            }

            this._getAnswerRankNode(code).text(value);
        });
    }

    _updateAnswerOtherNodes({values = [], otherValues = []}) {
        if (values.length > 0) {
            this._question.answers.filter(answer => answer.isOther).forEach(answer => {
                const isSelected = this._isSelected(answer);

                const answerOtherNode = this._getAnswerOtherNode(answer.code);
                answerOtherNode
                    .attr('tabindex', isSelected ? '0' : '-1')
                    .attr('aria-hidden', isSelected ? 'false' : 'true');

                if (MultiCountHelper.isMultiCountSet(this._question.multiCount)) {
                    const isMaxMultiCountReached = MultiCountHelper.isMaxMultiCountReached(
                        Object.values(this._question.values).length,
                        this._question.multiCount
                    );
                    answerOtherNode.attr('disabled', isMaxMultiCountReached && !isSelected);
                }
            });
        }

        super._updateAnswerOtherNodes({otherValues});
    }

    _attachHandlersToDOM() {
        this.answers.forEach((answer, index) => {
            this._getAnswerNode(answer.code).on('click', () => this._onAnswerClick(answer));
            this._getAnswerNode(answer.code).on('focus', () => this._onAnswerNodeFocus(index));

            if (answer.isOther) {
                const otherInput = this._getAnswerOtherNode(answer.code);
                otherInput.on('click', e => e.stopPropagation());
                otherInput.on('keydown', e => e.stopPropagation());
                otherInput.on('input', e => this._onOtherInputValueChanged(answer, e.target.value));
            }
        });

        if (!this._settings.disableKeyboardSupport) {
            this._container.on('keydown', this._onKeyPress.bind(this));
        }
    }

    _toggleAnswer(answer) {
        if (!this._isSelected(answer)) {
            this._selectAnswer(answer);
            if (answer.isOther && Utils.isEmpty(this._question.otherValues[answer.code])) {
                this._getAnswerOtherNode(answer.code).focus();
            }
        } else {
            this._unselectAnswer(answer);
        }
    }

    _isSelected(answer) {
        return !Utils.isNotANumber(this._question.values[answer.code]);
    }

    _selectAnswer(answer) {
        if (MultiCountHelper.isMaxMultiCountReached(Object.values(this._question.values).length, this._question.multiCount)) {
            return;
        }

        const valuesArray = Object.values(this._question.values);
        const maxValue = valuesArray.length;

        this._question.setValue(answer.code, maxValue + 1);
    }

    _unselectAnswer(answer) {
        const oldValue = this._question.values[answer.code];

        this._question.setValue(answer.code, null);
        Object.entries(this._question.values).forEach(([code, value]) => {
            if (value > oldValue)
                this._question.setValue(code, value - 1);
        });
    }

    _updateRankingStatus() {
        /*
            should read in all cases:
            1) if answer selected
            2) if unselected all answers
            3) if other input value is changed
         */
        const answersStatuses = [];
        Object.entries(this._question.values).sort((a, b) => a[1] - b[1]).forEach(([answerCode, rank]) => {
            const answer = this._question.getAnswer(answerCode);
            let answerStatus = `${rank} ${answer.text}`;
            if (answer.isOther && !Utils.isEmpty(this._question.otherValues[answerCode])) {
                answerStatus += `(${this._question.otherValues[answerCode]})`;
            }

            answersStatuses.push(answerStatus);
        });

        const status = `${this._question.text}: ${answersStatuses.join(', ')}`;
        this._rankingStatusNode.html(status);
    }

    _onModelValueChange({changes}) {
        this._updateAnswerNodes(changes);
        this._updateAnswerOtherNodes(changes);
        this._updateRankingStatus(changes);
    }

    _onAnswerClick(answer) {
        this._toggleAnswer(answer);
    }

    _onAnswerNodeFocus(answerIndex) {
        this._currentAnswerIndex = answerIndex;
    }

    _onOtherInputValueChanged(answer, otherValue) {
        this._question.setOtherValue(answer.code, otherValue);

        if (!this._isSelected(answer) && !Utils.isEmpty(otherValue)) {
            this._selectAnswer(answer);
        }
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

        this._toggleAnswer(this._currentAnswer);
    }
}

export class RankingQuestionViewWithStoredOtherValues extends StoredOtherValuesMixin(RankingQuestionView) {
    constructor(question, settings) {
        super(question, settings, new RankingOtherValuesKeeper(question, settings));
    }
}