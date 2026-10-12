import UpdaterBase from './updater-base';
import LayoutType from './layout-type';
import $ from 'jquery';

export default class DropdownAnswersUpdater extends UpdaterBase {
    constructor(question, layoutType = LayoutType.Regular) {
        super(question);

        this._idProvider = this._getIdProviderByLayout(layoutType);
    }

    update(display) {
        if (!display) {
            return;
        }

        this._question.answers.forEach(answer => {
            $(`#${this._idProvider.getQuestionInputNodeId()} option[value="${answer.code}"]`).prepend(
                this._renderAnswerCode(this._question.id, answer.code)
            );
        });
    }
}
