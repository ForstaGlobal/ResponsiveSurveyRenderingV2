import TestNavigatorQuestion from './test-navigator-question';

/**
 * @desc Test navigator model.
 */
export default class TestNavigator {
    constructor(model) {
        this._questions = model.questions.map((question) => new TestNavigatorQuestion(question));
        this._currentQuestionId = model.currentQuestionId;
        this._extQuicktestCommentsEnabled = model.extQuicktestCommentsEnabled;
        this._commentingEndpoint = model.commentingEndpoint;
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
     * Whether or not ExtQuicktestComments feature toggle is enabled.
     * @type {boolean}
     * @readonly
     */
    get extQuicktestCommentsEnabled() {
        return this._extQuicktestCommentsEnabled;
    }

    /**
     * Commenting endpoint url
     * @type {string}
     * @readonly
     */
    get commentingEndpoint() {
        return this._commentingEndpoint;
    }
}
