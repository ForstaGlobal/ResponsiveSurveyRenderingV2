import Grid3DDesktopInnerQuestionView from "./grid-3d-desktop-inner-question-view";
import Utils from "../../../../utils";

export default class Grid3DDesktopInnerHorizontalRatingGridQuestionView extends Grid3DDesktopInnerQuestionView {
    constructor(parentQuestion, question, settings = null) {
        super(parentQuestion, question, settings);

        this._attachHandlersToDOM();
    }

    _getSelectedControlClass() {
        return  'cf-horizontal-rating-item--selected';
    }

    _attachHandlersToDOM() {
        this._question.answers.forEach(answer => {
            this._question.scales.forEach(scale => {
                this._getScaleNode(answer.code, scale.code).on('click', this._onScaleItemClick.bind(this, answer, scale));
            });
        });
    }

    _updateAnswerScaleNodes({values = []}) {
        if (values.length === 0)
            return;
        values.forEach(answerCode => {
            this._question.scales.forEach(scale => {
                this._clearScaleControlNode(answerCode, scale.code);
            });

            const scaleCode = this._question.values[answerCode];
            if (scaleCode === undefined) {
                //this._getScaleControlNode(answerCode, this._scales[0].code).attr('tabindex', '0');
            } else {
                this._selectScaleControlNode(answerCode, scaleCode);
            }
        });
    }

    _clearScaleControlNode(answerCode, scaleCode) {
        this._getScaleControlNode(answerCode, scaleCode)
            .removeClass(this._getSelectedControlClass(scaleCode))
            .attr('aria-checked', 'false')
            //.attr('tabindex', '-1')
            .css('background-color', '')
            .css('border-color', '');
    }

    _selectScaleControlNode(answerCode, scaleCode) {
        const controlNode = this._getScaleControlNode(answerCode, scaleCode);
        controlNode
            .addClass(this._getSelectedControlClass(scaleCode))
            .attr('aria-checked', 'true');
            //.attr('tabindex', '0');

        const scale = this._question.getScale(scaleCode);
        if (!Utils.isEmpty(scale.backgroundColor)) {
            controlNode.css({backgroundColor: scale.backgroundColor, borderColor: scale.backgroundColor});
        }
    }

    _onModelValueChange({changes}) {
        this._updateAnswerScaleNodes(changes);
    }

    _onScaleItemClick(answer, scale) {
        this._question.setValue(answer.code, scale.code);
    }
}