import CompositeUpdater from './base/composite-updater';
import CleanupUpdater from './base/cleanup-updater';
import OtherAnswersUpdater from './base/other-answers-updater';
import AnswersUpdater from './base/answers-updater';

export default class CarouselMultiGridUpdater extends CompositeUpdater {
    constructor(question) {
        super([
            new CleanupUpdater(question),
            new CompositeUpdater(
                question.innerQuestions.map(innerQuestion => {
                    return new CompositeUpdater([
                        new AnswersUpdater(innerQuestion),
                        new OtherAnswersUpdater(innerQuestion),
                    ]);
                })
            ),
        ]);
    }
}
