import DesktopQuestionIdProvider from "../../helpers/desktop-question-id-provider";
import RatingGridQuestionViewBase from 'views/questions/base/rating-grid-question-view-base';

export default class DesktopHorizontalRatingGridQuestionView extends RatingGridQuestionViewBase {
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
        return this._isItemInScale(scaleCode) ? "cf-horizontal-rating-item--selected" : "cf-non-scored-rating-item--selected";
    }
}