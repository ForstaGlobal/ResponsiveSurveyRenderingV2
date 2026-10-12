import CompositeUpdater from './base/composite-updater';
import CleanupUpdater from './base/cleanup-updater';
import OtherAnswersUpdater from './base/other-answers-updater';
import AnswersUpdater from './base/answers-updater';
import ScalesUpdater from './base/scales-updater';

export default class CardSortGridUpdater extends CompositeUpdater {
    constructor(question) {
        super([
            new CleanupUpdater(question),
            new AnswersUpdater(question),
            new OtherAnswersUpdater(question),
            new ScalesUpdater(question),
        ]);
    }
}
