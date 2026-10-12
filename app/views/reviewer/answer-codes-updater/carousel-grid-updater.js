import CompositeUpdater from './base/composite-updater';
import CleanupUpdater from './base/cleanup-updater';
import OtherAnswersUpdater from './base/other-answers-updater';
import AnswersUpdater from './base/answers-updater';
import AnswerScalesUpdater from './base/answer-scales-updater';

export default class CarouselGridUpdater extends CompositeUpdater {
    constructor(question) {
        super([
            new CleanupUpdater(question),
            new AnswersUpdater(question),
            new OtherAnswersUpdater(question),
            new AnswerScalesUpdater(question),
        ]);
    }
}
