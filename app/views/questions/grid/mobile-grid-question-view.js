import MobileQuestionIdProvider from "../../helpers/mobile-question-id-provider";
import GridQuestionViewBase from "./grid-question-view-base";

export default class MobileGridQuestionView extends GridQuestionViewBase {
    /**
     * @param {GridQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings = null) {
        super(question, settings);
    }

    _createIdProvider(questionId) {
        return new MobileQuestionIdProvider(questionId);
    }
}