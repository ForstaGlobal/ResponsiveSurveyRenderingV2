import QuestionTypes from '../../../api/question-types';
import LayoutType from './base/layout-type';
import CompositeUpdater from './base/composite-updater';
import CleanupUpdater from './base/cleanup-updater';
import DropdownScalesUpdater from './base/dropdown-scales-updater';
import AnswerScalesUpdater from './base/answer-scales-updater';
import AnswersUpdater from './base/answers-updater';
import OtherAnswersUpdater from './base/other-answers-updater';
import ScalesUpdater from './base/scales-updater';
import RatingScoredAnswerScalesUpdater from './base/rating-scored-answer-scales-updater';

export default class Grid3dUpdater extends CompositeUpdater {
    constructor(question) {
        super([
            new CleanupUpdater(question),
            new AnswersUpdater(question, LayoutType.Desktop),
            new OtherAnswersUpdater(question, LayoutType.Desktop),

            new CompositeUpdater(
                question.innerQuestions.map(innerQuestion => {
                    const updater = new CompositeUpdater();
                    updater.add(new AnswersUpdater(innerQuestion, LayoutType.Mobile));
                    updater.add(new OtherAnswersUpdater(innerQuestion, LayoutType.Mobile));
                    switch (innerQuestion.type) {
                        case QuestionTypes.Single:
                        case QuestionTypes.Multi:
                            if (innerQuestion.answerButtons) {
                                updater.add(new AnswersUpdater(innerQuestion, LayoutType.Desktop));
                            }
                            break;
                        case QuestionTypes.Grid:
                            if (innerQuestion.answerButtons) {
                                updater.add(new AnswerScalesUpdater(innerQuestion, LayoutType.Desktop));
                            }
                            if (innerQuestion.dropdown) {
                                updater.add(new DropdownScalesUpdater(innerQuestion, LayoutType.Desktop));
                                updater.add(new DropdownScalesUpdater(innerQuestion, LayoutType.Mobile));
                                updater.add(new ScalesUpdater(innerQuestion, LayoutType.Mobile));
                                break;
                            }
                            if (innerQuestion.slider) {
                                updater.add(new ScalesUpdater(innerQuestion, LayoutType.Desktop));
                                updater.add(new ScalesUpdater(innerQuestion, LayoutType.Mobile));
                                break;
                            }
                            updater.add(new ScalesUpdater(innerQuestion, LayoutType.Desktop));
                            updater.add(new AnswerScalesUpdater(innerQuestion, LayoutType.Mobile));
                            break;
                        case QuestionTypes.StarRating:
                            updater.add(new AnswerScalesUpdater(innerQuestion, LayoutType.Mobile));
                            break;
                        case QuestionTypes.GridBars:
                            updater.add(new AnswerScalesUpdater(innerQuestion, LayoutType.Mobile));
                            updater.add(new ScalesUpdater(innerQuestion, LayoutType.Desktop));
                            break;
                        case QuestionTypes.HorizontalRatingScale:
                            updater.add(new RatingScoredAnswerScalesUpdater(innerQuestion, LayoutType.Mobile));
                            updater.add(new RatingScoredAnswerScalesUpdater(innerQuestion, LayoutType.Desktop));
                            break;
                    }
                    return updater;
                })
            ),
        ]);
    }
}
