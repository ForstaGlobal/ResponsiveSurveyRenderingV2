import UpdaterBase from './updater-base';
import LayoutType from './layout-type';
import $ from 'jquery';

export default class OtherAnswersUpdater extends UpdaterBase {
    constructor(question, layoutType = LayoutType.Regular) {
        super(question);
        this._idProvider = this._getIdProviderByLayout(layoutType);
    }

    update(display) {
        this._question.answers
            .filter(answer => answer.isOther)
            .forEach(answer => {
                const placeholder = display ? `${answer.code}: ${answer.text}` : answer.text;
                $('#' + this._idProvider.getAnswerOtherNodeId(answer.code)).attr('placeholder', placeholder);
            });
    }
}
