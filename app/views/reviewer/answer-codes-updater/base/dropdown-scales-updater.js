import UpdaterBase from './updater-base';
import LayoutType from './layout-type';
import $ from 'jquery';

export default class DropdownScalesUpdater extends UpdaterBase {
    constructor(question, layoutType = LayoutType.Regular) {
        super(question);

        this._idProvider = this._getIdProviderByLayout(layoutType);
    }

    update(display) {
        if (!display) {
            return;
        }

        this._question.answers.forEach(answer => {
            this._question.scales.forEach(scale => {
                $(`#${this._idProvider.getAnswerInputNodeId(answer.code)} option[value="${scale.code}"]`).prepend(
                    this._renderAnswerCode(this._question.id, scale.code)
                );
            });
        });
    }
}
