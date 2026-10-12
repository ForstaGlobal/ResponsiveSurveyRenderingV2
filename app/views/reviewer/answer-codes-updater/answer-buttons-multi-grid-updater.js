import LayoutType from './base/layout-type';
import CompositeUpdater from './base/composite-updater';
import CleanupUpdater from './base/cleanup-updater';
import OtherAnswersUpdater from './base/other-answers-updater';
import AnswersUpdater from './base/answers-updater';

export default class AnswerButtonsMultiGridUpdater extends CompositeUpdater {
    constructor(question) {
        super([
            new CleanupUpdater(question),
            new CompositeUpdater(
                question.innerQuestions.map(innerQuestion => {
                    return new CompositeUpdater([
                        new AnswersUpdater(innerQuestion, LayoutType.Desktop),
                        new OtherAnswersUpdater(innerQuestion, LayoutType.Desktop),
                        new AnswersUpdater(innerQuestion, LayoutType.Mobile),
                        new OtherAnswersUpdater(innerQuestion, LayoutType.Mobile),
                    ]);
                })
            ),
        ]);
    }
}
