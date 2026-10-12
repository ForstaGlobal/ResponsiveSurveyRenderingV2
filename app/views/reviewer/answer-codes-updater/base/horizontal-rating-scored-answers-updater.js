import UpdaterBase from './updater-base';
import $ from 'jquery';

export default class HorizontalRatingScoredAnswersUpdater extends UpdaterBase {
    constructor(question) {
        super(question);

        this._idProvider = this._getIdProviderByLayout();
    }

    update(display) {
        if (!display) {
            return;
        }

        this._question.scaleItems.forEach(answer => {
            $(`#${this._idProvider.getAnswerControlNodeId(answer.code)} `).prepend(
                this._renderAnswerCode(this._question.id, answer.code)
            );
        });
    }
}
