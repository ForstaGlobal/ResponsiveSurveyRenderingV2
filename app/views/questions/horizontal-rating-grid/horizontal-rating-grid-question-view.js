import CompositeQuestionView from 'views/questions/base/composite-question-view.js';
import MobileHorizontalGridQuestionView from './mobile-horizontal-rating-grid-question-view.js';
import DesktopHorizontalRatingGridQuestionView from './desktop-horizontal-rating-grid-question-view.js';

export default class HorizontalRatingGridQuestionView extends CompositeQuestionView {
    /**
     * @param {GridRatingQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(
            question,
            [
                new MobileHorizontalGridQuestionView(question, settings),
                new DesktopHorizontalRatingGridQuestionView(question, settings)
            ],
            settings
        );
    }
}