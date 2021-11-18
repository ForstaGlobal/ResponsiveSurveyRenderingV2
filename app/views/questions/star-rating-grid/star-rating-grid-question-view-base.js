import RatingGridQuestionViewBase from 'views/questions/base/rating-grid-question-view-base';

export default class StarRatingGridQuestionViewBase extends RatingGridQuestionViewBase {
    /**
     * @param {GridRatingQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings = null) {
        super(question, settings);
    }

    _selectScaleControlNode(answerCode, scaleCode) {
        this._selectScaleControlVisually(answerCode, scaleCode);
        this._getScaleControlNode(answerCode, scaleCode)
            .attr('aria-checked', 'true')
            .attr('tabindex', '0');

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
            controlNode.css({backgroundColor: scale.backgroundColor, borderColor: scale.backgroundColor});

            if(this._isItemInScale(scaleCode)){
                controlNode.css('color', scale.backgroundColor)
            }
        }
    }

    _clearScaleControlNode(answerCode, scaleCode) {
        super._clearScaleControlNode(answerCode, scaleCode);

        if(this._isItemInScale(scaleCode)) {
            this._getScaleControlNode(answerCode, scaleCode)
                .css('color', '');
        }
    }
}