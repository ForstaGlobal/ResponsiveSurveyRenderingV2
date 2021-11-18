import Grid3DDesktopInnerQuestionView from "./grid-3d-desktop-inner-question-view";

export default class Grid3DDesktopInnerStarRatingGridQuestionView extends Grid3DDesktopInnerQuestionView {
    constructor(parentQuestion, question, settings = null) {
        super(parentQuestion, question, settings);

        this._attachHandlersToDOM();
    }

    _getSelectedControlClass() {
        return  'cf-star-rating-item--selected';
    }

    _isItemInScale(scaleCode) {
        return this._question.scaleItems.find(item => item.code === scaleCode) !== undefined;
    }

    _attachHandlersToDOM() {
        this._question.answers.forEach(answer => {
            this._question.scales.forEach(scale => {
                this._getScaleNode(answer.code, scale.code)
                    .on('click', this._onScaleNodeClick.bind(this, answer, scale));
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

    _clearScaleControlNode(answerCode, scaleCode) {
        this._getScaleControlNode(answerCode, scaleCode)
            .removeClass(this._getSelectedControlClass(scaleCode))
            .attr('aria-checked', 'false')
            //.attr('tabindex', '-1')
            .css('background-color', '')
            .css('border-color', '')
            .css('color', '');
    }

    _selectScaleControlNode(answerCode, scaleCode) {
        this._selectScaleControlVisually(answerCode, scaleCode);
        this._getScaleControlNode(answerCode, scaleCode)
            .attr('aria-checked', 'true');
            //.attr('tabindex', '0');

        if(this._isItemInScale(scaleCode)) {
            const scaleIndex = this._question.scaleItems.findIndex(item => item.code === scaleCode);
            if (scaleIndex !== -1) {
                this._question.scaleItems.forEach((scale, index) => {
                    if (index < scaleIndex) {
                        this._selectScaleControlVisually(answerCode, scale.code);
                    }
                });
            }
        }
    }

    _selectScaleControlVisually(answerCode, scaleCode) {
        const controlNode = this._getScaleControlNode(answerCode, scaleCode);
        controlNode.addClass(this._getSelectedControlClass(scaleCode));
        const scale = this._question.getScale(scaleCode);
        if (scale.backgroundColor !== null) {
            controlNode.css({backgroundColor: scale.backgroundColor, color: scale.backgroundColor, borderColor: scale.backgroundColor});
        }
    }

    _onModelValueChange({changes}) {
        this._updateAnswerScaleNodes(changes);
    }

    _onScaleNodeClick(answer, scale) {
        this._question.setValue(answer.code, scale.code);
    }
}