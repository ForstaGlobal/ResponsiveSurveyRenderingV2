import Utils from '../../utils';
import SearchableQuestionViewBase from './base/searchable-question-view-base';
import StoredOtherValuesMixin from "./base/stored-other-values-mixin";
import {SingleOtherValuesKeeper} from "../helpers/other-values-keeper";

export default class SearchableSingleQuestionView extends StoredOtherValuesMixin(SearchableQuestionViewBase) {
    constructor(question, settings = null) {
        super(question, settings, new SingleOtherValuesKeeper(question, settings));

        this._selectedAnswerCssClass = 'cf-radio-answer--selected';
        this._selectedControlCssClass = 'cf-radio--selected';
    }

    _attachHandlersToDOM() {
        super._attachHandlersToDOM();

        this.answers.forEach(answer => {
            this._getAnswerNode(answer.code).on('click', this._onAnswerNodeClick.bind(this, answer));

            if (answer.isOther) {
                const otherInput = this._getAnswerOtherNode(answer.code);
                otherInput.on('click', e => e.stopPropagation());
                otherInput.on('input', e => this._onAnswerOtherNodeValueChange(answer, e.target.value));
            }
        });
    }

    _getSelectedAnswerText(answer) {
        return answer.isOther && !Utils.isEmpty(this._question.otherValues[answer.code]) ? this._question.otherValues[answer.code] : answer.text;
    }

    _renderAnswer(answer) {
        const isSelected = answer.code === this._question.value;
        const rtlCssModifier = Utils.getRtlCSSClassModifier(this._question, 'cf-radio-answer');

        return `           
            <div class="cf-radio-answer ${rtlCssModifier} ${isSelected ? this._selectedAnswerCssClass : ''}" id="${this._getAnswerNodeId(answer.code)}">
                <div class="cf-radio-answer__control">
                     <div class="cf-radio ${isSelected ? this._selectedControlCssClass : ''}" ${this._getAnswerColorStyle(answer)} id="${this._getAnswerControlNodeId(answer.code)}"></div>              
                </div>
                <div class="cf-radio-answer__content">
                     <div class="cf-radio-answer__text" id="${this._getAnswerTextNodeId(answer.code)}">${answer.text}</div>              
                </div>
            </div>
        `;
    }

    _getAnswerColorStyle(answer) {
        return answer.code === this._question.value && !Utils.isEmpty(answer.backgroundColor) ?
            `style="background-color: ${answer.backgroundColor}; border-color: ${answer.backgroundColor}"`
            :
            '';
    }

    // eslint-disable-next-line no-unused-vars
    _unselectAnswer(answer) {
        this._question.setValue(null);
    }

    _updateAnswerNodes({value}) {
        if (value === undefined) {
            return;
        }

        this._question.answers.forEach(answer => {
            this._getAnswerNode(answer.code).removeClass(this._selectedAnswerCssClass);
            this._getAnswerControlNode(answer.code)
              .removeClass(this._selectedControlCssClass)
              .css('background-color', '')
              .css('border-color', '');
        });

        if (this._question.value === null) {
            return;
        }

        const answer = this._question.getAnswer(this._question.value);
        this._getAnswerNode(answer.code).addClass(this._selectedAnswerCssClass);

        const controlNode = this._getAnswerControlNode(answer.code);
        controlNode.addClass(this._selectedControlCssClass);
        if (!Utils.isEmpty(answer.backgroundColor)) {
            controlNode.css({backgroundColor: answer.backgroundColor, borderColor: answer.backgroundColor});
        }
    }

    _selectAnswer(answer) {
        this._question.setValue(answer.code);

        if (answer.isOther) {
            const otherInput = this._getAnswerOtherNode(answer.code);
            this._question.setOtherValue(otherInput.val());
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
        this._selectAnswer(answer);
    }

    _onAnswerOtherNodeValueChange(answer, otherValue) {
        if (!Utils.isEmpty(otherValue)) { // select answer
            this._question.setValue(answer.code);
        }

        if (this._question.value === answer.code) { // update other value for currently selected answer
            this._question.setOtherValue(answer.code, otherValue);
        }
    }
}