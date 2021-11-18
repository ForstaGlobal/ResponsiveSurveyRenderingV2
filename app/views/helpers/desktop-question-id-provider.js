import QuestionIdProvider from './question-id-provider';

export default class DesktopQuestionIdProvider extends QuestionIdProvider {
    constructor(questionId) {
        super(questionId);
    }

    getQuestionNodeId() {
        return 'desktop_' + super.getQuestionNodeId();
    }

    getQuestionTitleNodeId() {
        return 'desktop_' + super.getQuestionTitleNodeId();
    }

    getQuestionTextNodeId() {
        return 'desktop_' + super.getQuestionTextNodeId();
    }

    getQuestionInstructionNodeId() {
        return 'desktop_' + super.getQuestionInstructionNodeId();
    }

    getQuestionErrorNodeId() {
        return 'desktop_' + super.getQuestionErrorNodeId();
    }

    getQuestionContentNodeId() {
        return 'desktop_' + super.getQuestionContentNodeId();
    }

    getQuestionInputNodeId() {
        return 'desktop_' + super.getQuestionInputNodeId();
    }

    getAnswerErrorBlockId(answerCode) {
        return 'desktop_' + super.getAnswerErrorBlockId(answerCode);
    }

    getAnswerErrorListId(answerCode) {
        return 'desktop_' + super.getAnswerErrorListId(answerCode);
    }

    getAnswerOtherErrorBlockId(answerCode) {
        return 'desktop_' + super.getAnswerOtherErrorBlockId(answerCode);
    }

    getAnswerNodeId(answerCode) {
        return 'desktop_' + super.getAnswerNodeId(answerCode);
    }

    getAnswerInputNodeId(answerCode) {
        return 'desktop_' + super.getAnswerInputNodeId(answerCode);
    }

    getAnswerTextNodeId(answerCode) {
        return 'desktop_' + super.getAnswerTextNodeId(answerCode);
    }

    getAnswerTextRightNodeId(answerCode) {
        return 'desktop_' + super.getAnswerTextRightNodeId(answerCode);
    }

    getAnswerOtherNodeId(answerCode) {
        return 'desktop_' + super.getAnswerOtherNodeId(answerCode);
    }

    getAnswerControlNodeId(answerCode) {
        return 'desktop_' + super.getAnswerControlNodeId(answerCode);
    }

    getScaleControlNodeId(answerCode, scaleCode){
        return 'desktop_' + super.getScaleControlNodeId(answerCode, scaleCode);
    }

    getScaleNodeId(answerCode, scaleCode) {
        return 'desktop_' + super.getScaleNodeId(answerCode, scaleCode);
    }

    getScaleTextNodeId(answerCode, scaleCode) {
        return 'desktop_' + super.getScaleTextNodeId(answerCode, scaleCode);
    }
}