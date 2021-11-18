import Grid3DDesktopInnerQuestionView from "./grid-3d-desktop-inner-question-view";
import Utils from "../../../../utils";

export default class Grid3DDesktopInnerGridBarsGridQuestionView extends Grid3DDesktopInnerQuestionView {
    constructor(parentQuestion, question, settings = null) {
        super(parentQuestion, question, settings);

        this._attachHandlersToDOM();
    }

    _getSelectedControlClass() {
        return  'cf-grid-bars-item--selected';
    }

    _attachHandlersToDOM() {
        const mouseOver = (answerCode, scaleCode) => {
            if (this._question.values[answerCode])
                return; // don't handle if already answered

            this._clearAnswerHoverStyles(answerCode);
            this._setAnswerHoverStyles(answerCode, scaleCode);
        };

        const mouseOut = (answerCode) => {
            if (this._question.values[answerCode])
                return; // don't handle if already answered

            this._clearAnswerHoverStyles(answerCode);
        };

        this._question.answers.forEach(answer => {
            this._question.scales.forEach(scale => {
                this._getScaleNode(answer.code, scale.code)
                    .on('click', this._onScaleItemClick.bind(this, answer, scale))
                    .on('mouseover', () => mouseOver(answer.code, scale.code))
                    .on('mouseout', () => mouseOut(answer.code));
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
                // this._getScaleControlNode(answerCode, this._question.scales[0].code)
                //     .attr('tabindex', '0');
            } else {
                this._selectScaleControlNode(answerCode, scaleCode);
            }
        });
    }

    _selectScaleControlNode(answerCode, scaleCode) {
        const selectedScaleIndex = this._question.scaleItems.findIndex(item => item.code === scaleCode);
        if(selectedScaleIndex > -1) {
            this._question.scaleItems.forEach((scale, scaleIndex) => {
                if (scaleIndex <= selectedScaleIndex) {
                    const controlNode = this._getScaleControlNode(answerCode, scale.code);
                    controlNode.addClass(this._getSelectedControlClass(scale.code));
                    if (!Utils.isEmpty(scale.backgroundColor)) {
                        controlNode
                            .css('background-color', scale.backgroundColor)
                            .css('border-color', scale.backgroundColor);
                    } else {
                        controlNode
                            .css('opacity', (scaleIndex + 2) / (this._question.scaleItems.length + 1));
                    }
                }
            });
        } else {
            const controlNode = this._getScaleControlNode(answerCode, scaleCode);
            controlNode.addClass(this._getSelectedControlClass(scaleCode));
            const scale = this._question.getScale(scaleCode);
            if (!Utils.isEmpty(scale.backgroundColor)) {
                controlNode
                    .css('background-color', scale.backgroundColor)
                    .css('border-color', scale.backgroundColor);
            }
        }

        this._getScaleControlNode(answerCode, scaleCode)
            .attr('aria-checked', 'true');
            //.attr('tabindex', '0');
    }

    _clearScaleControlNode(answerCode, scaleCode) {
        this._getScaleControlNode(answerCode, scaleCode)
            .removeClass(this._getSelectedControlClass(scaleCode))
            .removeClass('cf-grid-bars-item--hover')
            .attr('aria-checked', 'false')
            //.attr('tabindex', '-1')
            .css('opacity', '')
            .css('background-color', '')
            .css('border-color', '');
    }

    _setAnswerHoverStyles(answerCode, scaleCode) {
        const scaleIndex = this._question.scaleItems.findIndex(item => item.code === scaleCode);
        if (scaleIndex !== -1) {
            this._question.scaleItems.forEach((item, index) => {
                if (index <= scaleIndex) {
                    this._setScaleHoverStyles(answerCode, item, index);
                }
            });
        }
    }

    _clearAnswerHoverStyles(answerCode) {
        this._question.scales.forEach(scale => {
            this._getScaleControlNode(answerCode, scale.code)
                .removeClass('cf-grid-bars-item--hover')
                .css('opacity', '')
                .css('background-color', '')
                .css('border-color', '');
        });
    }

    _setScaleHoverStyles(answerCode, scale, scaleIndex) {
        const controlNode = this._getScaleControlNode(answerCode, scale.code);
        controlNode.addClass('cf-grid-bars-item--hover');

        if (!Utils.isEmpty(scale.backgroundColor)) {
            controlNode
                .css('background-color', scale.backgroundColor)
                .css('border-color', scale.backgroundColor);
        } else {
            controlNode
                .css('opacity', (scaleIndex + 2) / (this._question.scaleItems.length + 1));
        }
    }

    _onModelValueChange({changes}) {
        this._updateAnswerScaleNodes(changes);
    }

    _onScaleItemClick(answer, scale) {
        this._question.setValue(answer.code, scale.code);
    }
}