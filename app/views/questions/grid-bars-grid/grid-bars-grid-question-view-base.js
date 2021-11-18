import RatingGridQuestionViewBase from 'views/questions/base/rating-grid-question-view-base';
import Utils from "../../../utils";

export default class GridBarsGridQuestionViewBase extends RatingGridQuestionViewBase {
    /**
     * @param {GridRatingQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings = null){
        super(question, settings);
    }

    // TODO: move text hover and selection to mobile version: STAYED HERE
    _attachToDOM() {
        super._attachToDOM();

        const mouseOver = (answerCode, scaleCode) => {
            const answerValue = this._question.values[answerCode];
            if (answerValue && this._isItemInScale(answerValue))
                return; // don't handle if already answered and in scale

            this._clearAnswerHoverStyles(answerCode);
            this._setAnswerHoverStyles(answerCode, scaleCode);
        };

        const mouseOut = (answerCode) => {
            const answerValue = this._question.values[answerCode];
            if (answerValue && this._isItemInScale(answerValue))
                return; // don't handle if already answered and in scale

            this._clearAnswerHoverStyles(answerCode);
        };

        this._question.answers.forEach(answer => {
            this._question.scaleItems.forEach(scale => {
                this._getScaleNode(answer.code, scale.code)
                    .on('mouseover', () => mouseOver(answer.code, scale.code))
                    .on('mouseout', () => mouseOut(answer.code));
            });
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
            .attr('aria-checked', 'true')
            .attr('tabindex', '0');
    }

    _clearScaleControlNode(answerCode, scaleCode) {
        super._clearScaleControlNode(answerCode, scaleCode);

        this._getScaleControlNode(answerCode, scaleCode)
            .removeClass('cf-grid-bars-item--hover');
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
        this._getAnswerNode(answerCode).find('.cf-grid-bars-item')
            .removeClass('cf-grid-bars-item--hover')
            .css('opacity', '')
            .css('background-color', '')
            .css('border-color', '');
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
}