import CompositeQuestionView from 'views/questions/base/composite-question-view.js';
import MobileGridQuestionView from './mobile-grid-question-view.js';
import DesktopGridQuestionView from './desktop-grid-question-view.js';

export default class GridQuestionView extends CompositeQuestionView {
    /**
     * @param {GridQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(
            question,
            [
                new MobileGridQuestionView(question, settings),
                new DesktopGridQuestionView(question, settings)
            ],
            settings
        );
    }
}