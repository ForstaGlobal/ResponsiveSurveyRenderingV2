import LayoutType from './base/layout-type';
import CompositeUpdater from './base/composite-updater';
import CleanupUpdater from './base/cleanup-updater';
import OtherAnswersUpdater from './base/other-answers-updater';
import AnswersUpdater from './base/answers-updater';
import RatingNonScoredAnswerScalesUpdater from './base/rating-non-scored-answer-scales-updater';
import AnswerScalesUpdater from './base/answer-scales-updater';

export default class StarRatingGridUpdater extends CompositeUpdater {
    constructor(question) {
        super([
            new CleanupUpdater(question),
            new AnswersUpdater(question, LayoutType.Desktop),
            new OtherAnswersUpdater(question, LayoutType.Desktop),
            new RatingNonScoredAnswerScalesUpdater(question, LayoutType.Desktop),
            new AnswersUpdater(question, LayoutType.Mobile),
            new OtherAnswersUpdater(question, LayoutType.Mobile),
            new AnswerScalesUpdater(question, LayoutType.Mobile),
        ]);
    }
}
