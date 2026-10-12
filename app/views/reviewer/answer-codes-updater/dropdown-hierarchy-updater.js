import CleanupUpdater from './base/cleanup-updater';
import UpdaterBase from './base/updater-base';
import $ from 'jquery';

export default class DropdownHierarchyUpdater extends UpdaterBase {
    constructor(question) {
        super(question);
        this._idProvider = this._getIdProviderByLayout();
        this._cleanupUpdater = new CleanupUpdater(question);

        this._question.changeEvent.on(() => setTimeout(() => this.update(question), 0));
    }

    update(display) {
        this._cleanupUpdater.update(display);

        if (!display) {
            return;
        }

        this._question.answers.forEach(answer => {
            $(`#${this._idProvider.getQuestionNodeId()} option[value="${answer.code}"]`).prepend(
                this._renderAnswerCode(this._question.id, answer.code)
            );
        });
    }
}
