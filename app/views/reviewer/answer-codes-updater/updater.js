import QuestionTypes from '../../../api/question-types';
import BlankUpdater from './blank-updater';
import CleanupUpdater from './base/cleanup-updater';
import DropdownAnswersUpdater from './base/dropdown-answers-updater';
import SearchableDecorator from './base/searchable-decorator';
import CompositeUpdater from './base/composite-updater';
import HorizontalRatingScoredAnswersUpdater from './base/horizontal-rating-scored-answers-updater';
import AnswerScalesUpdater from './base/answer-scales-updater';
import AnswersUpdater from './base/answers-updater';
import OtherAnswersUpdater from './base/other-answers-updater';
import Grid3dUpdater from './grid-3d-updater';
import MultiGridUpdater from './multi-grid-updater';
import CarouselMultiGridUpdater from './carousel-multi-grid-updater';
import AnswerButtonsMultiGridUpdater from './answer-buttons-multi-grid-updater';
import StarRatingGridUpdater from './star-rating-grid-updater';
import CarouselStarRatingGridUpdater from './carousel-star-rating-grid-updater';
import CarouselGridBarsGridUpdater from './carousel-grid-bars-grid-updater';
import GridBarsGridUpdater from './grid-bars-grid-updater';
import CarouselHorizontalRatingGridUpdater from './carousel-hrs-grid-updater';
import HorizontalRatingGridUpdater from './horizontal-rating-grid-updater';
import GridUpdater from './grid-updater';
import SliderGridUpdater from './slider-grid-updater';
import CardSortGridUpdater from './card-sort-grid-updater';
import AccordionGridUpdater from './accordion-grid-updater';
import CarouselGridUpdater from './carousel-grid-updater';
import DropdownGridUpdater from './dropdown-grid-updater';
import AnswerButtonsGridUpdater from './answer-buttons-grid-updater';
import DropdownHierarchyUpdater from './dropdown-hierarchy-updater';

export default class AnswerCodesUpdater {
    constructor() {
        this._updaters = new Map();
    }

    update(question, display) {
        if (!this._updaters.has(question.id)) {
            this._updaters.set(question.id, this._createUpdater(question));
        }
        const updater = this._updaters.get(question.id);
        if (!updater) return;

        updater.update(display);
    }

    _createUpdater(question) {
        switch (question.type) {
            case QuestionTypes.OpenText:
            case QuestionTypes.Numeric:
            case QuestionTypes.Date:
            case QuestionTypes.EmailOpen:
            case QuestionTypes.GeoLocation:
            case QuestionTypes.ImageUploader:
            case QuestionTypes.FileUpload:
            case QuestionTypes.VideoCapture:
            case QuestionTypes.AudioCapture:
            case QuestionTypes.CodeCapture:
            case QuestionTypes.DynamicQuestionPlaceholder:
            case QuestionTypes.Login:
            case QuestionTypes.Info:
                return new BlankUpdater(question);

            case QuestionTypes.Single:
                if (question.dropdown) {
                    return new CompositeUpdater([new CleanupUpdater(question), new DropdownAnswersUpdater(question)]);
                }
                return new CompositeUpdater([
                    new CleanupUpdater(question),
                    new AnswersUpdater(question),
                    new OtherAnswersUpdater(question),
                ]);

            case QuestionTypes.Multi:
            case QuestionTypes.OpenTextList:
            case QuestionTypes.NumericList:
            case QuestionTypes.Ranking:
                return new CompositeUpdater([
                    new CleanupUpdater(question),
                    new AnswersUpdater(question),
                    new OtherAnswersUpdater(question),
                ]);

            case QuestionTypes.SearchableSingle:
            case QuestionTypes.SearchableMulti:
                return new SearchableDecorator(
                    new CompositeUpdater([
                        new CleanupUpdater(question),
                        new AnswersUpdater(question),
                        new OtherAnswersUpdater(question),
                    ]),
                    question
                );

            case QuestionTypes.Hierarchy:
                return new DropdownHierarchyUpdater(question);

            case QuestionTypes.HorizontalRatingScaleSingle:
                return new CompositeUpdater([
                    new CleanupUpdater(question),
                    new AnswersUpdater(question),
                    new HorizontalRatingScoredAnswersUpdater(question),
                ]);
            case QuestionTypes.GridBarsSingle:
            case QuestionTypes.StarRatingSingle:
                return new CompositeUpdater([new CleanupUpdater(question), new AnswersUpdater(question)]);

            case QuestionTypes.ChartSingle:
                return new CompositeUpdater([new CleanupUpdater(question), new AnswersUpdater(question)]);

            case QuestionTypes.ChartGrid:
                return new CompositeUpdater([
                    new CleanupUpdater(question),
                    new AnswersUpdater(question),
                    new AnswerScalesUpdater(question),
                ]);

            case QuestionTypes.Grid:
                if (question.answerButtons) {
                    return new AnswerButtonsGridUpdater(question);
                }
                if (question.dropdown) {
                    return new DropdownGridUpdater(question);
                }
                if (question.accordion) {
                    return new AccordionGridUpdater(question);
                }
                if (question.carousel) {
                    return new CarouselGridUpdater(question);
                }
                if (question.cardSort) {
                    return new CardSortGridUpdater(question);
                }
                if (question.slider) {
                    return new SliderGridUpdater(question);
                }
                return new GridUpdater(question);

            case QuestionTypes.HorizontalRatingScale:
                if (question.carousel) {
                    return new CarouselHorizontalRatingGridUpdater(question);
                }
                return new HorizontalRatingGridUpdater(question);

            case QuestionTypes.GridBars:
                if (question.carousel) {
                    return new CarouselGridBarsGridUpdater(question);
                }
                return new GridBarsGridUpdater(question);

            case QuestionTypes.StarRating:
                if (question.carousel) {
                    return new CarouselStarRatingGridUpdater(question);
                }
                return new StarRatingGridUpdater(question);

            case QuestionTypes.Grid3d:
                if (question.maxDiff) {
                    return new CompositeUpdater([new CleanupUpdater(question), new AnswersUpdater(question)]);
                }
                if (question.multiGrid) {
                    const isAnswerButtons = question.innerQuestions.some(innerQuestion => innerQuestion.answerButtons);
                    if (isAnswerButtons) {
                        return new AnswerButtonsMultiGridUpdater(question);
                    }
                    if (question.carousel) {
                        return new CarouselMultiGridUpdater(question);
                    }

                    return new MultiGridUpdater(question);
                }

                return new Grid3dUpdater(question);

            case QuestionTypes.MaxDiff:
                return new CompositeUpdater([new CleanupUpdater(question), new AnswersUpdater(question)]);

            default:
                // eslint-disable-next-line no-console
                console.warn(`Answer code updater: unsupported type ${question.type}`);
        }
    }
}
