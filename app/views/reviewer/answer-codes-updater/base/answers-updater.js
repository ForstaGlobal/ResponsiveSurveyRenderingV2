import UpdaterBase from './updater-base';
import LayoutType from './layout-type';
import $ from 'jquery';

export default class AnswersUpdater extends UpdaterBase {
    constructor(question, layoutType = LayoutType.Regular) {
        super(question);
        this._idProvider = this._getIdProviderByLayout(layoutType);
    }

    update(display) {
        if (!display) {
            return;
        }

        this._question.answers.forEach(answer => {
            const answerCodeMarkup = this._renderAnswerCode(this._question.id, answer.code);
            $('#' + this._idProvider.getAnswerTextNodeId(answer.code)).prepend(answerCodeMarkup);
        });
    }
}
