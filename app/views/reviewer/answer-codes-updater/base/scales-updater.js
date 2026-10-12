import UpdaterBase from './updater-base';
import LayoutType from './layout-type';
import $ from 'jquery';

export default class ScalesUpdater extends UpdaterBase {
    constructor(question, layoutType = LayoutType.Regular) {
        super(question);
        this._idProvider = this._getIdProviderByLayout(layoutType);
    }

    update(display) {
        if (!display) {
            return;
        }

        this._question.scales.forEach(scale => {
            const answerCodeMarkup = this._renderAnswerCode(this._question.id, scale.code);
            $('#' + this._idProvider.getCommonScaleTextNodeId(scale.code)).prepend(answerCodeMarkup);
        });
    }
}
