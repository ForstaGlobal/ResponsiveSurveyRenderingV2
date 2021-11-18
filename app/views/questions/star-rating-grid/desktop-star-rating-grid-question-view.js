import DesktopQuestionIdProvider from "../../helpers/desktop-question-id-provider";
import StarRatingGridQuestionViewBase from "./star-rating-grid-question-view-base";

export default class DesktopStarRatingGridQuestionView extends StarRatingGridQuestionViewBase {
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
        return this._isItemInScale(scaleCode) ? "cf-star-rating-item--selected" : "cf-non-scored-rating-item--selected";
    }
}