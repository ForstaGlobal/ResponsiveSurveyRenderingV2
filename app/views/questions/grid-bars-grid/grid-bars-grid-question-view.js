import CompositeQuestionView from 'views/questions/base/composite-question-view.js';
import MobileGridBarsGridQuestionView from './mobile-grid-bars-grid-question-view';
import DesktopGridBarsGridQuestionView from './desktop-grid-bars-grid-question-view';

export default class GridBarsGridQuestionView extends CompositeQuestionView {
    /**
     * @param {GridRatingQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(
            question,
            [
                new MobileGridBarsGridQuestionView(question, settings),
                new DesktopGridBarsGridQuestionView(question, settings)
            ],
            settings
        );
    }
}