import QuestionView from './question-view.js';

export default class CompositeQuestionView extends QuestionView {
    /**
     * @param {Question} question
     * @param {QuestionViewBase[]} questionViews
     * @param {QuestionViewSettings} settings
     */
    constructor(question, questionViews, settings = null) {
        super(question, settings);

        this._onQuestionViewPendingChange = this._onQuestionViewPendingChange.bind(this);

        this._questionViews = questionViews;
        this._questionViews.forEach(view => {
           view.pendingChangeEvent.on(this._onQuestionViewPendingChange);
        });
    }

    detach() {
        this._questionViews.forEach(view => {
            view.detach();
            view.pendingChangeEvent.off(this._onQuestionViewPendingChange);
        });
    }

    _onQuestionViewPendingChange() {
        const viewsHasPending = this._questionViews.some(view => view.pending);
        if(viewsHasPending === this.pending) {
            return;
        }

        this.pending = viewsHasPending;
    }
}