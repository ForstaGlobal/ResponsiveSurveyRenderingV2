import CompositeQuestionView from 'views/questions/base/composite-question-view.js';
import MobileStarGridQuestionView from './mobile-star-rating-grid-question-view.js';
import DesktopStarRatingGridQuestionView from './desktop-star-rating-grid-question-view.js';

export default class StarRatingGridQuestionView extends CompositeQuestionView {
    /**
     * @param {GridRatingQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(
            question,
            [
                new MobileStarGridQuestionView(question, settings),
                new DesktopStarRatingGridQuestionView(question, settings)
            ],
            settings
        );
    }
}