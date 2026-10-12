import IUpdater from './updater-interface';

export default class SearchableDecorator extends IUpdater {
    constructor(updater, question) {
        super();

        this._updater = updater;
        this._lastDisplayValue = false;

        question.loadMoreAnswersCompleteEvent.on(() => this.update(this._lastDisplayValue));
        question.filterAnswersCompleteEvent.on(() => this.update(this._lastDisplayValue));
    }

    update(display) {
        this._lastDisplayValue = display;
        this._updater.update(display);
    }
}
