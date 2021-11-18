import DesktopQuestionIdProvider from "../../helpers/desktop-question-id-provider";
import GridQuestionViewBase from "./grid-question-view-base";

export default class DesktopGridQuestionView extends GridQuestionViewBase {
    /**
     * @param {GridQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings = null) {
        super(question, settings);
    }

    _createIdProvider(questionId) {
        return new DesktopQuestionIdProvider(questionId);
    }
}