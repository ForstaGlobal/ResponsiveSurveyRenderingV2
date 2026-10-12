import QuestionIdProvider from '../../../helpers/question-id-provider';
import IUpdater from './updater-interface';
import $ from 'jquery';

export default class CleanupUpdater extends IUpdater {
    constructor(question) {
        super();
        this._idProvider = new QuestionIdProvider(question.id);
    }

    // eslint-disable-next-line no-unused-vars
    update(display) {
        $(`#${this._idProvider.getQuestionNodeId()}`).find('.sr-answer-code-attribute').remove();
    }
}
