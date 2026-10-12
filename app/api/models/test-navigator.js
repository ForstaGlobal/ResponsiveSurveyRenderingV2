import TestNavigatorQuestion from './test-navigator-question';

/**
 * @desc Test navigator model.
 */
export default class TestNavigator {
    constructor(model) {
        this._questions = model.questions.map(question => new TestNavigatorQuestion(question));
        this._currentQuestionId = model.currentQuestionId;
        this._autoResponderEnabled = model.autoResponderEnabled;
        this._commentingEndpoint = model.commentingEndpoint;
        this._authQueryString = model.authQueryString;
        this._displayQuestionId = model.displayQuestionId ?? false;
        this._displayQuestionCategory = model.displayQuestionCategory ?? false;
        this._displayQuestionMasking = model.displayQuestionMasking ?? false;
        this._displayQuestionNotRequired = model.displayQuestionNotRequired ?? false;
        this._displayAnswerCodes = model.displayAnswerCodes ?? false;
    }

    /**
     * Models of test navigator questions.
     * @type {TestNavigatorQuestion[]}
     * @readonly
     */
    get questions() {
        return this._questions;
    }

    /**
     * Model current question id.
     * @type {string}
     * @readonly
     */
    get currentQuestionId() {
        return this._currentQuestionId;
    }

    /**
     * Is autoresponder enabled.
     * @type {boolean}
     * @readonly
     */
    get autoResponderEnabled() {
        return this._autoResponderEnabled;
    }

    /**
     * Commenting endpoint url
     * @type {string}
     * @readonly
     */
    get commentingEndpoint() {
        return this._commentingEndpoint;
    }

    /**
     * Commenting endpoint authentication query string
     * @type {string}
     * @readonly
     */
    get authQueryString() {
        return this._authQueryString;
    }

    /**
     * Show question id.
     * @type {boolean}
     * @readonly
     */
    get displayQuestionId() {
        return this._displayQuestionId;
    }

    /**
     * Show question category.
     * @type {boolean}
     * @readonly
     */
    get displayQuestionCategory() {
        return this._displayQuestionCategory;
    }

    /**
     * Show is question masking enabled.
     * @type {boolean}
     * @readonly
     */
    get displayQuestionMasking() {
        return this._displayQuestionMasking;
    }

    /**
     * Show is question required.
     * @type {boolean}
     * @readonly
     */
    get displayQuestionNotRequired() {
        return this._displayQuestionNotRequired;
    }

    /**
     * Show answers codes
     * @type {boolean}
     * @readonly
     */
    get displayAnswerCodes() {
        return this._displayAnswerCodes;
    }
}
