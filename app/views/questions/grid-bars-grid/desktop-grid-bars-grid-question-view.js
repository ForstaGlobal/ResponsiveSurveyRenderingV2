import DesktopQuestionIdProvider from "../../helpers/desktop-question-id-provider";
import GridBarsGridQuestionViewBase from "./grid-bars-grid-question-view-base";

export default class DesktopGridBarsGridQuestionView extends GridBarsGridQuestionViewBase {
    /**
     * @param {GridRatingQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings = null) {
        super(question, settings);
    }

    _createIdProvider(questionId) {
        return new DesktopQuestionIdProvider(questionId);
    }

    _getSelectedControlClass(scaleCode) {
        return this._isItemInScale(scaleCode) ? "cf-grid-bars-item--selected" : "cf-non-scored-rating-item--selected";
    }
}