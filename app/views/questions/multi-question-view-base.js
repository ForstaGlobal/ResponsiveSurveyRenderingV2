import QuestionWithAnswersView from './base/question-with-answers-view';
import Utils from './../../utils';
import KEYS from '../helpers/keyboard-keys';
import ValidationTypes from '../../api/models/validation/validation-types';
import CollapsibleGroup from '../controls/collapsible-group';
import GroupTypes from '../../api/group-types';
import MultiCountHelper from '../helpers/multi-count-helper';

export default class MultiQuestionViewBase extends QuestionWithAnswersView {
    /**
     * @param {QuestionWithAnswers} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);

        this._currentAnswerIndex = null;
        this._collapsibleGroups = this._createCollapsibleGroups();

        this._attachHandlersToDOM();
    }

    get _currentAnswer() {
        return this.answers[this._currentAnswerIndex];
    }

    /**
     * @type {Array} list of selected answer codes
     * @protected
     * @abstract
     */
    _getSelectedAnswerCodes() {
        throw 'Not implemented exception';
    }

    /**
     * @param {Answer} answer
     * @protected
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    _selectAnswer(answer) {
        throw 'Not implemented exception';
    }

    /**
     * @param {Answer} answer
     * @protected
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars
    _unselectAnswer(answer) {
        throw 'Not implemented exception';
    }

    _createCollapsibleGroups() {
        const prepareCollapsibleGroupShortInfo = (question, group) => {
            return group.items
                .filter(answer => this._getSelectedAnswerCodes().includes(answer.code))
                .map(answer => answer.isOther ? question.otherValues[answer.code] : answer.text)
                .filter(shortInfoText => !Utils.isEmpty(shortInfoText));
        };

        return this._question.answerGroups
            .filter(group => group.type === GroupTypes.Collapsible)
            .map(group => new CollapsibleGroup(this._question, group, prepareCollapsibleGroupShortInfo));
    }

    _attachHandlersToDOM() {
        this.answers.forEach((answer, index) => {
            this._getAnswerNode(answer.code).on('click', () => this._onAnswerNodeClick(answer));
            this._getAnswerControlNode(answer.code).on('focus', this._onAnswerNodeFocus.bind(this, index));

            if (answer.isOther) {
                const otherInput = this._getAnswerOtherNode(answer.code);
                otherInput.on('click', e => e.stopPropagation());
                otherInput.on('keydown', e => e.stopPropagation());
                otherInput.on('input', e => this._onAnswerOtherNodeValueChange(answer, e.target.value));
            }
        });

        if (!this._settings.disableKeyboardSupport) {
            this._container.on('keydown', this._onKeyPress.bind(this));
        }
    }

    _getSelectedControlClass(answer){
        if(answer.imagesSettings !== null){
            return 'cf-image--selected';
        }

        if(answer.isExclusive){
            return 'cf-radio--selected';
        }

        return'cf-checkbox--selected';
    }

    _getSelectedAnswerClass(answer) {
        if(answer.imagesSettings !== null){
            return 'cf-image-answer--selected';
        }

        if(answer.isExclusive){
            return 'cf-radio-answer--selected';
        }

        return 'cf-checkbox-answer--selected';
    }

    _getDisabledAnswerClass(answer) {
        if(answer.imagesSettings !== null) {
            return 'cf-image-answer--disabled';
        }

        if (this._question.answerButtons) {
            return 'cf-button-answer--disabled';
        }

        return 'cf-checkbox-answer--disabled';
    }

    _selectAnswerNode(answer){
        this._getAnswerNode(answer.code).addClass(this._getSelectedAnswerClass(answer));
        const controlNode = this._getAnswerControlNode(answer.code);
        controlNode
            .addClass(this._getSelectedControlClass(answer))
            .attr('aria-checked', true);

        if (answer.backgroundColor !== null) {
            controlNode.css({backgroundColor: answer.backgroundColor, borderColor: answer.backgroundColor});
        }
    }

    _clearAnswerNode(answer){
        this._getAnswerNode(answer.code)
            .removeClass(this._getSelectedAnswerClass(answer))
            .removeClass(this._getDisabledAnswerClass(answer));

        this._getAnswerControlNode(answer.code)
            .removeClass(this._getSelectedControlClass(answer))
            .attr('aria-checked', false)
            .css({backgroundColor: "", borderColor: ""});
    }

    _updateAnswerNodes({values = []}) {
        if (values.length === 0)
            return;

        const selectedAnswerCodes = this._getSelectedAnswerCodes();

        this._question.answers.forEach(answer => {
            this._clearAnswerNode(answer);

            const isMaxMultiCountReached = MultiCountHelper.isMaxMultiCountReached(this._getSelectedAnswerCodes().length, this._question.multiCount);
            if (isMaxMultiCountReached && !answer.isExclusive && !selectedAnswerCodes.includes(answer.code)) {
                this._getAnswerNode(answer.code).addClass(this._getDisabledAnswerClass(answer));
            }
        });

        selectedAnswerCodes.forEach(answerCode => this._selectAnswerNode(this._question.getAnswer(answerCode)));
    }

    _updateAnswerOtherNodes({values = [], otherValues = []}) {
        if (values.length > 0) {
            const isMaxMultiCountReached = MultiCountHelper.isMaxMultiCountReached(
                this._getSelectedAnswerCodes().length,
                this._question.multiCount
            );

            this._question.answers
                .filter((answer) => answer.isOther)
                .forEach((answer) => {
                    const isSelected = this._isSelected(answer);

                    const answerOtherNode = this._getAnswerOtherNode(answer.code);
                    answerOtherNode
                        .attr('tabindex', isSelected ? '0' : '-1')
                        .attr('aria-hidden', isSelected ? 'false' : 'true');

                    if (MultiCountHelper.isMultiCountSet(this._question.multiCount)) {
                        answerOtherNode.attr('disabled', isMaxMultiCountReached && !isSelected);
                    }
                });
        }

        super._updateAnswerOtherNodes({otherValues});
    }

    _isSelected(answer) {
        return this._getSelectedAnswerCodes().includes(answer.code);
    }

    _toggleAnswer(answer) {
        const newValue = !this._isSelected(answer);
        if (newValue) {
            this._selectAnswer(answer);
        } else {
            this._unselectAnswer(answer);
        }

        if (newValue && answer.isOther) {
            const otherInput = this._getAnswerOtherNode(answer.code);
            if (Utils.isEmpty(otherInput.val())) {
                otherInput.focus();
            }
        }
    }

    _setQuestionOtherValue(answer, otherValue) {
        this._question.setOtherValue(answer.code, otherValue);

        if (!this._isSelected(answer) && !Utils.isEmpty(otherValue)) {
            this._selectAnswer(answer);
        }
    }

    /**
     * @param {QuestionValidationResult} validationResult
     * @protected
     */
    _showErrors(validationResult) {
        super._showErrors(validationResult);
        this._updateGroupAriaInvalidState(validationResult);
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
        const otherErrors = validationResult.errors.filter(error => error.type === ValidationTypes.OtherRequired);
        if (otherErrors.length === 0) {
            return;
        }

        const errorBlockId = this._getAnswerErrorBlockId(validationResult.answerCode);
        const otherNode = this._getAnswerOtherNode(validationResult.answerCode);
        otherNode
            .attr('aria-errormessage', errorBlockId)
            .attr('aria-invalid', 'true');
    }

    _updateGroupAriaInvalidState(validationResult) {
        if (validationResult.isValid) {
            return;
        }

        const hasNotOnlyOtherErrors = validationResult.errors.length > 0
            || validationResult.answerValidationResults.filter(result => result.isValid === false)
                .some(result => result.errors.some(error => error.type !== ValidationTypes.OtherRequired));
        if (hasNotOnlyOtherErrors === false) {
            return;
        }

        this._container.find('.cf-list').attr('aria-invalid', 'true');
    }

    _hideErrors() {
        super._hideErrors();

        this._container.find('.cf-list').attr('aria-invalid', 'false');

        this._question.answers.filter(answer => answer.isOther).forEach(answer => {
            this._getAnswerOtherNode(answer.code)
                .removeAttr('aria-errormessage')
                .removeAttr('aria-invalid');
        });
    }

    _onModelValueChange({changes}) {
        this._updateAnswerNodes(changes);
        this._updateAnswerOtherNodes(changes);
    }

    _onAnswerNodeClick(answer) {
        this._getAnswerControlNode(answer.code).focus();
        this._toggleAnswer(answer);
    }

    _onAnswerOtherNodeValueChange(answer, otherValue) {
        this._setQuestionOtherValue(answer, otherValue);
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

        this._toggleAnswer(this._currentAnswer);
    }
}