import Utils from '../../utils';
import SearchableQuestionViewBase from './base/searchable-question-view-base';
import MultiCountHelper from '../helpers/multi-count-helper';
import StoredOtherValuesMixin from "./base/stored-other-values-mixin";
import {MultiOtherValuesKeeper} from "../helpers/other-values-keeper";

export default class SearchableMultiQuestionView extends StoredOtherValuesMixin(SearchableQuestionViewBase) {
    constructor(question, settings = null) {
        super(question, settings, new MultiOtherValuesKeeper(question, settings));
        this._disabledAnswerClass = 'cf-checkbox-answer--disabled';
    }

    _getSelectedAnswerText(answer) {
        return answer.isOther && !Utils.isEmpty(this._question.otherValues[answer.code])
            ? this._question.otherValues[answer.code] : answer.text;
    }

    _getSelectedControlClass(answer){
        if(answer.isExclusive){
            return 'cf-radio--selected';
        }

        return 'cf-checkbox--selected';
    }

    _getSelectedAnswerClass(answer) {
        if(answer.isExclusive){
            return 'cf-radio-answer--selected';
        }

        return  'cf-checkbox-answer--selected';
    }

    _renderAnswer(answer) {
        const isSelected = this._isSelected(answer);
        const isMaxMultiCountReached = MultiCountHelper.isMaxMultiCountReached(this._question.values.length, this._question.multiCount);
        const isDisabled = isMaxMultiCountReached && !isSelected;
        const rtlCssModifier = Utils.getRtlCSSClassModifier(this._question, 'cf-checkbox-answer');

        return `
            <div class="cf-checkbox-answer ${ isSelected ? this._getSelectedAnswerClass(answer) : ''} ${rtlCssModifier} ${isDisabled ? this._disabledAnswerClass : ''}" id="${this._getAnswerNodeId(answer.code)}">
                <div class="cf-checkbox-answer__control">
                     <div class="cf-checkbox ${ isSelected ? this._getSelectedControlClass(answer) : ''}" ${this._getAnswerColorStyle(answer)} id="${this._getAnswerControlNodeId(answer.code)}"></div>              
                </div>
                <div class="cf-checkbox-answer__content">
                     <div class="cf-checkbox-answer__text" id="${this._getAnswerTextNodeId(answer.code)}" aria-hidden="true">${answer.text}</div>              
                </div>
            </div>
        `;
    }

    _getAnswerColorStyle(answer) {
        return this._question.values.includes(answer.code) && !Utils.isEmpty(answer.backgroundColor) ?
            `style="background-color: ${answer.backgroundColor}; border-color: ${answer.backgroundColor}"`
            :
            '';
    }

    _selectAnswer(answer) {
        const isMaxMultiCountReached = MultiCountHelper.isMaxMultiCountReached(this._question.values.length, this._question.multiCount);
        if (isMaxMultiCountReached && !answer.isExclusive) {
            return;
        }

        this._question.setValue(answer.code, true);
    }

    _unselectAnswer(answer) {
        this._question.setValue(answer.code, false);
    }

    _attachHandlersToDOM() {
        super._attachHandlersToDOM();

        this.answers.forEach(answer => {
            this._getAnswerNode(answer.code).on('click', () => this._onAnswerNodeClick(answer));
            if (answer.isOther) {
                const otherInput = this._getAnswerOtherNode(answer.code);
                otherInput.on('click', e => e.stopPropagation());
                otherInput.on('input', e => this._onAnswerOtherNodeValueChange(answer, e.target.value));
            }
        });
    }

    _selectAnswerNode(answer) {
        this._getAnswerNode(answer.code).addClass(this._getSelectedAnswerClass(answer));
        const controlNode = this._getAnswerControlNode(answer.code);

        controlNode.addClass(this._getSelectedControlClass(answer));
        if (!Utils.isEmpty(answer.backgroundColor)) {
            controlNode.css({backgroundColor: answer.backgroundColor, borderColor: answer.backgroundColor});
        }
    }

    _clearAnswerNode(answer) {
        this._getAnswerNode(answer.code)
            .removeClass(this._getSelectedAnswerClass(answer))
            .removeClass(this._disabledAnswerClass);

        this._getAnswerControlNode(answer.code)
          .removeClass(this._getSelectedControlClass(answer))
          .css('background-color', '')
          .css('border-color', '');
    }

    _updateAnswerNodes({values = []}) {
        if (values.length === 0)
            return;

        this._question.answers.forEach(answer => {
            this._clearAnswerNode(answer);

            const isMaxMultiCountReached = MultiCountHelper.isMaxMultiCountReached(this._question.values.length, this._question.multiCount);
            if (isMaxMultiCountReached && !answer.isExclusive && !this._question.values.includes(answer.code)) {
                this._getAnswerNode(answer.code).addClass(this._disabledAnswerClass);
            }
        });

        this._question.values.forEach(answerCode => this._selectAnswerNode(this._question.getAnswer(answerCode)));
    }

    _updateAnswerOtherNodes(changes) {
        super._updateAnswerOtherNodes(changes);

        if (MultiCountHelper.isMultiCountSet(this._question.multiCount)) {
            this._question.answers
                .filter(answer => answer.isOther)
                .forEach(answer => {
                    const answerOtherNode = this._getAnswerOtherNode(answer.code);

                    const isMaxMultiCountReached = MultiCountHelper.isMaxMultiCountReached(
                        this._question.values.length,
                        this._question.multiCount
                    );
                    answerOtherNode.attr('disabled', isMaxMultiCountReached && !this._question.values[answer.code]);
                });
        }
    }

    _isSelected(answer) {
        return this._question.values.includes(answer.code);
    }

    _toggleAnswer(answer) {
        if (this._isSelected(answer)) {
            this._unselectAnswer(answer);
            return;
        }

        this._selectAnswer(answer);
        if (answer.isOther) {
            const otherInput = this._getAnswerOtherNode(answer.code);
            if (Utils.isEmpty(otherInput.val())) {
                otherInput.focus();
            }
        }
    }

    _onModelValueChange(data) {
        super._onModelValueChange(data.changes);

        this._updateAnswerNodes(data.changes);
        this._updateAnswerOtherNodes(data.changes);
    }

    _onAnswerNodeClick(answer) {
        this._toggleAnswer(answer);
    }

    _onAnswerOtherNodeValueChange(answer, otherValue) {
        if (!Utils.isEmpty(otherValue)) {
            this._question.setOtherValue(answer.code, otherValue);
        }

        if (!this._isSelected(answer) && !Utils.isEmpty(otherValue)) {
            this._selectAnswer(answer);
        }
    }
}