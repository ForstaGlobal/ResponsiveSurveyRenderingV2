import CompositeQuestionView from 'views/questions/base/composite-question-view.js';
import MobileMultiGridQuestionView from './mobile-multi-grid-question-view.js';
import MobileAnswerButtonsMultiGridQuestionView from './mobile-answer-buttons-multi-grid-question-view';
import DesktopMultiGridQuestionView from './desktop-multi-grid-question-view.js';
import DesktopAnswerButtonsMultiGridQuestionView from './desktop-answer-buttons-multi-grid-question-view';

export default class MultiGridQuestionView extends CompositeQuestionView {
    /**
     * @param {Grid3DQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        let desktopView;
        let mobileView;

        const isAnswerButtons =  question.innerQuestions[0] !== undefined && question.innerQuestions[0].answerButtons || false;
        if(isAnswerButtons) {
            desktopView = new DesktopAnswerButtonsMultiGridQuestionView(question, settings);
            mobileView = new MobileAnswerButtonsMultiGridQuestionView(question, settings);
        } else {
            desktopView = new DesktopMultiGridQuestionView(question, settings);
            mobileView = new MobileMultiGridQuestionView(question, settings);
        }

        super(question, [ mobileView, desktopView ], settings);
    }
}