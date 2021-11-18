import QuestionViewBase from "../../base/question-view-base";
import DesktopQuestionIdProvider from "../../../helpers/desktop-question-id-provider";
import $ from "jquery";

export default class Grid3DDesktopInnerQuestionView extends QuestionViewBase {
    constructor(parentQuestion, question, settings = null) {
        super(question, settings);

        this._parentQuestion = parentQuestion;
        this._parentContainer = $(`#${parentQuestion.id}`);
        this._container = this._parentContainer.find('.cf-grid-3d-desktop');
        this._idProvider = new DesktopQuestionIdProvider(question.id);
    }

    _getAnswerErrorBlockId(answerCode) {
        return this._idProvider.getAnswerErrorBlockId(answerCode);
    }

    _getAnswerNode(answerCode) {
        return $('#' + this._idProvider.getAnswerNodeId(answerCode));
    }

    _getAnswerTextNode(answerCode) {
        return $('#' + this._idProvider.getAnswerTextNodeId(answerCode));
    }

    _getAnswerControlNode(answerCode) {
        return $('#' + this._idProvider.getAnswerControlNodeId(answerCode));
    }

    _getAnswerOtherNode(answerCode) {
        return  $('#' + this._idProvider.getAnswerOtherNodeId(answerCode));
    }

    _getScaleNode(answerCode, scaleCode) {
        return $('#' + this._idProvider.getScaleNodeId(answerCode, scaleCode));
    }

    _getScaleControlNode(answerCode, scaleCode) {
        return $('#' + this._idProvider.getScaleControlNodeId(answerCode, scaleCode));
    }
}