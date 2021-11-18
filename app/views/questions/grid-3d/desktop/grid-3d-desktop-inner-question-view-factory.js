import Grid3DDesktopInnerSingleQuestionView from './grid-3d-desktop-inner-single-question-view.js';
import Grid3DDesktopInnerSingleAnswerButtonsQuestionView from './grid-3d-desktop-inner-single-answer-buttons-question-view';
import Grid3DDesktopInnerMultiQuestionView from './grid-3d-desktop-inner-multi-question-view.js';
import Grid3DDesktopInnerMultiAnswerButtonsQuestionView from './grid-3d-desktop-inner-multi-answer-buttons-question-view';
import Grid3DDesktopInnerOpenListQuestionView from './grid-3d-desktop-inner-open-list-question-view.js';
import Grid3DDesktopInnerNumericListQuestionView from './grid-3d-desktop-inner-numeric-list-question-view.js';
import Grid3DDesktopInnerRankByNumberQuestionView from './grid-3d-desktop-inner-rank-by-number-view';
import Grid3DDesktopInnerGridQuestionView from './grid-3d-desktop-inner-grid-question-view.js';
import Grid3DDesktopInnerDropdownGridQuestionView from './grid-3d-desktop-inner-dropdown-grid-question-view.js';
import Grid3DDesktopInnerSliderGridQuestionView from './grid-3d-desktop-inner-slider-grid-question-view.js';
import QuestionTypes from 'api/question-types.js';
import Grid3DDesktopInnerStarRatingGridQuestionView from "./grid-3d-desktop-inner-star-rating-grid-question-view";
import Grid3DDesktopInnerHorizontalRatingGridQuestionView
    from "./grid-3d-desktop-inner-horizontal-rating-grid-question-view";
import Grid3DDesktopInnerGridBarsGridQuestionView from "./grid-3d-desktop-inner-grid-bars-grid-question-view";

/**
 * @desc Question view factory
 */
export default class Grid3DDesktopInnerQuestionViewFactory {

    constructor(question, settings) {
        this._question = question;
        this._settings = settings;
    }

    /**
     * Create question view.
     * @param {object} innerQuestion Question model.
     * @returns {object|undefined} Question view.
     */
    create(innerQuestion) {
        switch (innerQuestion.type) {
            case QuestionTypes.Single:
                if (innerQuestion.answerButtons) {
                    return new Grid3DDesktopInnerSingleAnswerButtonsQuestionView(this._question, innerQuestion, this._settings);
                }
                return new Grid3DDesktopInnerSingleQuestionView(this._question, innerQuestion, this._settings);
            case QuestionTypes.Multi:
                if (innerQuestion.answerButtons) {
                    return new Grid3DDesktopInnerMultiAnswerButtonsQuestionView(this._question, innerQuestion, this._settings);
                }
                return new Grid3DDesktopInnerMultiQuestionView(this._question, innerQuestion, this._settings);
            case QuestionTypes.OpenTextList:
                return new Grid3DDesktopInnerOpenListQuestionView(this._question, innerQuestion, this._settings);
            case QuestionTypes.NumericList:
                return new Grid3DDesktopInnerNumericListQuestionView(this._question, innerQuestion, this._settings);
            case QuestionTypes.HorizontalRatingScale:
                return new Grid3DDesktopInnerHorizontalRatingGridQuestionView(this._question, innerQuestion, this._settings);
            case QuestionTypes.StarRating:
                return new Grid3DDesktopInnerStarRatingGridQuestionView(this._question, innerQuestion, this._settings);
            case QuestionTypes.GridBars:
                return new Grid3DDesktopInnerGridBarsGridQuestionView(this._question, innerQuestion, this._settings);
            case QuestionTypes.Grid:
                if (innerQuestion.dropdown) {
                    return new Grid3DDesktopInnerDropdownGridQuestionView(this._question, innerQuestion, this._settings);
                }
                if (innerQuestion.slider) {
                    return new Grid3DDesktopInnerSliderGridQuestionView(this._question, innerQuestion, this._settings);
                }
                return new Grid3DDesktopInnerGridQuestionView(this._question, innerQuestion, this._settings);
            case QuestionTypes.Ranking:
                if (innerQuestion.rankByNumber) {
                    return new Grid3DDesktopInnerRankByNumberQuestionView(this._question, innerQuestion, this._settings);
                }
                return;
            default:
                return;
        }
    }
}