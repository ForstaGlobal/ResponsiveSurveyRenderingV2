import MaxDiffQuestionView from './max-diff-question-view';

export default class AnswerButtonsMaxDiffQuestionView extends MaxDiffQuestionView {
    _getSelectedAnswerClass() {
        return 'cf-button-answer--selected';
    }

    _getSelectedControlClass() {
        return 'cf-button--selected';
    }

    _getAnswerColumnTextId(answerCode, columnId) {
        return `${this._idProvider.getAnswerNodeId(answerCode)}_${columnId}_text`;
    }
}
