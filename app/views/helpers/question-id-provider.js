export default class QuestionIdProvider {
    constructor(questionId) {
        this._questionId = questionId;
    }

    getQuestionNodeId() {
        return this._questionId;
    }

    getQuestionTitleNodeId() {
        return `${this._questionId}_title`;
    }

    getQuestionTextNodeId() {
        return `${this._questionId}_text`;
    }

    getQuestionInstructionNodeId() {
        return `${this._questionId}_instruction`;
    }

    getQuestionErrorNodeId() {
        return `${this._questionId}_error`;
    }

    getQuestionContentNodeId() {
        return `${this._questionId}_content`;
    }

    getQuestionInputNodeId() {
        return `${this._questionId}_input`;
    }

    getAnswerErrorBlockId(answerCode) {
        return `${this._questionId}_${answerCode}_error`
    }

    getAnswerErrorListId(answerCode) {
        return `${this._questionId}_${answerCode}_error_list`
    }

    getAnswerOtherErrorBlockId(answerCode) {
        return `${this._questionId}_${answerCode}_other_error`
    }

    getAnswerNodeId(answerCode) {
        return `${this._questionId}_${answerCode}`;
    }

    getAnswerInputNodeId(answerCode) {
        return `${this._questionId}_${answerCode}_input`;
    }

    getAnswerTextNodeId(answerCode) {
        return `${this._questionId}_${answerCode}_text`;
    }

    getAnswerTextRightNodeId(answerCode) {
        return `${this._questionId}_${answerCode}_text_right`;
    }

    getAnswerOtherNodeId(answerCode) {
        return `${this._questionId}_${answerCode}_other`;
    }

    getAnswerControlNodeId(answerCode) {
        return `${this._questionId}_${answerCode}_control`;
    }

    getScaleNodeId(answerCode, scaleCode) {
        return `${this._questionId}_${answerCode}_${scaleCode}`;
    }

    getScaleTextNodeId(answerCode, scaleCode) {
        return `${this._questionId}_${answerCode}_${scaleCode}_text`;
    }

    getScaleControlNodeId(answerCode, scaleCode){
        return `${this._questionId}_${answerCode}_${scaleCode}_control`;
    }
}