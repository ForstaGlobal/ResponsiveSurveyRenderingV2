import MobileQuestionIdProvider from "../../helpers/mobile-question-id-provider";
import StarRatingGridQuestionViewBase from "./star-rating-grid-question-view-base";
import FloatingPanel from "../../controls/floating-panel";

export default class MobileStarRatingGridQuestionView extends StarRatingGridQuestionViewBase {
    /**
     * @param {GridRatingQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings = null) {
        super(question, settings);

        this._floatingPanel = null;

        this._initFloatingLabels();
    }

    detach(){
        super.detach()
        this._floatingPanel.detach();
    }

    _createIdProvider(questionId) {
        return new MobileQuestionIdProvider(questionId);
    }

    _getScaleGroupNode(answerCode) {
        return this._getAnswerNode(answerCode).find('.cf-sr-single');
    }

    _getClickableScaleNode(answer, scale) {
        if(this._isItemInScale(scale.code)) {
            return this._getScaleControlNode(answer.code, scale.code);
        }
        return this._getScaleNode(answer.code, scale.code);
    }

    _getSelectedControlClass(scaleCode) {
        return this._isItemInScale(scaleCode) ? "cf-star-rating-item--selected" : "cf-radio--selected";
    }

    _updateAnswerScaleNodes({values = []}) {
        if (values.length === 0)
            return;

        super._updateAnswerScaleNodes({values});

        values.forEach(answerCode => {
            this._scales
                .filter(scale => !this._isItemInScale(scale.code))
                .forEach(scale => this._getScaleNode(answerCode, scale.code).removeClass('cf-radio-answer--selected'));

            const scaleCode = this._question.values[answerCode];
            if(!this._isItemInScale(scaleCode)) {
                this._getScaleNode(answerCode, scaleCode).addClass('cf-radio-answer--selected');
            }
        });
    }

    _initFloatingLabels() {
        const panel = this._container.find('.cf-floating-panel');
        const lastItem = this._container.find('.cf-mobile-grid-layout__answer--last .cf-star-rating-scale');
        this._floatingPanel = new FloatingPanel(panel, lastItem, this._settings.mobileThreshold);
    }
}