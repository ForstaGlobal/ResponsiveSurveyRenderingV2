import MobileQuestionIdProvider from "../../helpers/mobile-question-id-provider";
import GridBarsGridQuestionViewBase from "./grid-bars-grid-question-view-base";
import FloatingPanel from "../../controls/floating-panel";

export default class MobileGridBarsGridQuestionView extends GridBarsGridQuestionViewBase {
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
        return this._getAnswerNode(answerCode).find('.cf-gb-single');
    }

    _getSelectedControlClass(scaleCode) {
        return this._isItemInScale(scaleCode) ? "cf-grid-bars-item--selected" : "cf-radio--selected";
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
            if (!this._isItemInScale(scaleCode)) {
                this._getScaleNode(answerCode, scaleCode).addClass('cf-radio-answer--selected');
            }
        });
    }

    _selectScaleControlNode(answerCode, scaleCode) {
        super._selectScaleControlNode(answerCode, scaleCode);

        const selectedScaleIndex = this._question.scaleItems.findIndex(item => item.code === scaleCode);
        if(selectedScaleIndex > -1) {
            this._question.scaleItems.forEach((scale, scaleIndex) => {
                if (scaleIndex <= selectedScaleIndex) {
                    this._getScaleTextNode(answerCode, scale.code)
                        .addClass('cf-grid-bars-scale-texts-panel__item--selected');
                }
            });
        }
    }

    _clearScaleControlNode(answerCode, scaleCode) {
        super._clearScaleControlNode(answerCode, scaleCode);

        this._getScaleTextNode(answerCode, scaleCode)
            .removeClass('cf-grid-bars-scale-texts-panel__item--hover')
            .removeClass('cf-grid-bars-scale-texts-panel__item--selected');
    }

    _clearAnswerHoverStyles(answerCode) {
        super._clearAnswerHoverStyles(answerCode);

        this._getAnswerNode(answerCode).find('.cf-grid-bars-scale-texts-panel__item')
            .removeClass('cf-grid-bars-scale-texts-panel__item--hover');
    }

    _setScaleHoverStyles(answerCode, scale, scaleIndex) {
        super._setScaleHoverStyles(answerCode, scale, scaleIndex);

        this._getScaleTextNode(answerCode, scale.code).addClass('cf-grid-bars-scale-texts-panel__item--hover');
    }

    _initFloatingLabels() {
        const panel = this._container.find('.cf-floating-panel');
        const lastItem = this._container.find('.cf-mobile-grid-layout__answer--last .cf-grid-bars-scale-texts-panel');
        this._floatingPanel = new FloatingPanel(panel, lastItem, this._settings.mobileThreshold);
    }
}