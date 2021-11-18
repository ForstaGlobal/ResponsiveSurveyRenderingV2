import QuestionIdProvider from './question-id-provider';

export default class MobileQuestionIdProvider extends QuestionIdProvider {
    constructor(questionId) {
        super(questionId);
    }

    getQuestionNodeId() {
        return 'mobile_' + super.getQuestionNodeId();
    }

    getQuestionTitleNodeId() {
        return 'mobile_' + super.getQuestionTitleNodeId();
    }

    getQuestionTextNodeId() {
        return 'mobile_' + super.getQuestionTextNodeId();
    }

    getQuestionInstructionNodeId() {
        return 'mobile_' + super.getQuestionInstructionNodeId();
    }

    getQuestionErrorNodeId() {
        return 'mobile_' + super.getQuestionErrorNodeId();
    }

    getQuestionContentNodeId() {
        return 'mobile_' + super.getQuestionContentNodeId();
    }

    getQuestionInputNodeId() {
        return 'mobile_' + super.getQuestionInputNodeId();
    }

    getAnswerErrorBlockId(answerCode) {
        return 'mobile_' + super.getAnswerErrorBlockId(answerCode);
    }

    getAnswerErrorListId(answerCode) {
        return 'mobile_' + super.getAnswerErrorListId(answerCode);
    }

    getAnswerOtherErrorBlockId(answerCode) {
        return 'mobile_' + super.getAnswerOtherErrorBlockId(answerCode);
    }

    getAnswerNodeId(answerCode) {
        return 'mobile_' + super.getAnswerNodeId(answerCode);
    }

    getAnswerInputNodeId(answerCode) {
        return 'mobile_' + super.getAnswerInputNodeId(answerCode);
    }

    getAnswerTextNodeId(answerCode) {
        return 'mobile_' + super.getAnswerTextNodeId(answerCode);
    }

    getAnswerTextRightNodeId(answerCode) {
        return 'mobile_' + super.getAnswerTextRightNodeId(answerCode);
    }

    getAnswerOtherNodeId(answerCode) {
        return 'mobile_' + super.getAnswerOtherNodeId(answerCode);
    }

    getAnswerControlNodeId(answerCode) {
        return 'mobile_' + super.getAnswerControlNodeId(answerCode);
    }

    getScaleControlNodeId(answerCode, scaleCode){
        return 'mobile_' + super.getScaleControlNodeId(answerCode, scaleCode);
    }

    getScaleNodeId(answerCode, scaleCode) {
        return 'mobile_' + super.getScaleNodeId(answerCode, scaleCode);
    }

    getScaleTextNodeId(answerCode, scaleCode) {
        return 'mobile_' + super.getScaleTextNodeId(answerCode, scaleCode);
    }
}