import $ from 'jquery';

export default class MultiGridQuestionHelper {
    constructor(createIdProviderFn) {
        this._createIdProvider = createIdProviderFn;
        this._innerQuestionIdProviders = new Map();
    }

    _getInnerQuestionIdProvider(innerQuestionId) {
        if (!this._innerQuestionIdProviders.has(innerQuestionId)) {
            this._innerQuestionIdProviders.set(innerQuestionId, this._createIdProvider(innerQuestionId));
        }
        return this._innerQuestionIdProviders.get(innerQuestionId);
    }

    getInnerQuestionNodeId(questionId) {
        return questionId;
    }

    getInnerQuestionErrorNodeId(questionId) {
        return this._getInnerQuestionIdProvider(questionId).getQuestionErrorNodeId();
    }

    getInnerQuestionTextNodeId(questionId) {
        return this._getInnerQuestionIdProvider(questionId).getQuestionTextNodeId();
    }

    getInnerQuestionAnswerNodeId(questionId, answerCode) {
        return this._getInnerQuestionIdProvider(questionId).getAnswerNodeId(answerCode);
    }

    getInnerQuestionAnswerControlNodeId(questionId, answerCode) {
        return this._getInnerQuestionIdProvider(questionId).getAnswerControlNodeId(answerCode);
    }

    getInnerQuestionAnswerOtherNodeId(questionId, answerCode) {
        return this._getInnerQuestionIdProvider(questionId).getAnswerOtherNodeId(answerCode);
    }

    getInnerQuestionAnswerOtherErrorBlockId(questionId, answerCode) {
        return this._getInnerQuestionIdProvider(questionId).getAnswerOtherErrorBlockId(answerCode);
    }

    getInnerQuestionNode(questionId) {
        return $('#' + this._getInnerQuestionIdProvider(questionId).getQuestionNodeId());
    }

    getInnerQuestionErrorNode(questionId) {
        return $('#' + this._getInnerQuestionIdProvider(questionId).getQuestionErrorNodeId());
    }

    getInnerQuestionTextNode(questionId) {
        return $('#' + this._getInnerQuestionIdProvider(questionId).getQuestionTextNodeId());
    }

    getInnerQuestionAnswerNode(questionId, answerCode) {
        return $('#' + this._getInnerQuestionIdProvider(questionId).getAnswerNodeId(answerCode));
    }

    getInnerQuestionAnswerTextNode(questionId, answerCode) {
        return $('#' + this._getInnerQuestionIdProvider(questionId).getAnswerTextNodeId(answerCode));
    }

    getInnerQuestionAnswerControlNode(questionId, answerCode) {
        return $('#' + this._getInnerQuestionIdProvider(questionId).getAnswerControlNodeId(answerCode));
    }

    getInnerQuestionAnswerOtherNode(questionId, answerCode) {
        return $('#' + this._getInnerQuestionIdProvider(questionId).getAnswerOtherNodeId(answerCode));
    }
}