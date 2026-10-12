import LayoutType from './base/layout-type';
import CompositeUpdater from './base/composite-updater';
import CleanupUpdater from './base/cleanup-updater';
import OtherAnswersUpdater from './base/other-answers-updater';
import AnswersUpdater from './base/answers-updater';
import UpdaterBase from './base/updater-base';
import $ from 'jquery';

export default class MultiGridUpdater extends UpdaterBase {
    constructor(question) {
        super(question);
        this._updater = new CompositeUpdater([
            new CleanupUpdater(question),
            new OtherAnswersUpdater(question, LayoutType.Desktop),
            new CompositeUpdater(
                question.innerQuestions.map(innerQuestion => {
                    return new CompositeUpdater([
                        new AnswersUpdater(innerQuestion, LayoutType.Mobile),
                        new OtherAnswersUpdater(innerQuestion, LayoutType.Mobile),
                    ]);
                })
            ),
        ]);
    }

    update(display) {
        this._updater.update(display);

        if (!display) {
            return;
        }

        const desktopIdProvider = this._getIdProviderByLayout(LayoutType.Desktop);
        this._question.answers.forEach(answer => {
            const answerCodeMarkup = this._renderAnswerCode(this._question.id, answer.code);
            $('#' + desktopIdProvider.getAnswerTextNodeId(`${answer.code}_answer`)).prepend(answerCodeMarkup);
        });
    }
}
