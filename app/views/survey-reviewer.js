import QuestionTypes from 'api/question-types.js';
import $ from 'jquery';

export default class SurveyReviewer {
    constructor(page) {
        this._page = page;
        this._store = null;

        this._init();
    }

    _init() {
        const isTestNavigatorEnabled = this._page.testNavigator !== null;
        const isCommentingEnabled =
            isTestNavigatorEnabled &&
            this._page.testNavigator.extQuicktestCommentsEnabled &&
            this._page.serverVariables.get('__qtkey') !== null;

        if (!isTestNavigatorEnabled) {
            return;
        }

        import('confirmit-survey-reviewing-components').then(
            ({ configureAppStore, TestNavigator, CommentsPanel, CommentsButton /*, InstructionsDialog*/ }) => {
                this._initStore(configureAppStore);
                this._initTestNavigator(TestNavigator);
                if (isCommentingEnabled) {
                    this._initQuestionsCommenting(CommentsButton);
                    this._initCommentsPanel(CommentsPanel);
                }
            }
        );
    }

    _initStore(configureAppStore) {
        const surveyId = this._page.surveyInfo.surveyId;
        const testKey = this._page.serverVariables.get('__qtkey');
        const commentingEndpoint = this._page.testNavigator.commentingEndpoint;

        this._store = configureAppStore({
            questions: this._page.testNavigator.questions.map((question) => ({
                id: question.id,
                entityId: question.entityId,
                type: question.type,
                title: question.title,
                link: question.link,
            })),
            surveyId: surveyId,
            testKey: testKey,
            endpoint: commentingEndpoint,
        });
    }

    _initQuestionsCommenting(CommentsButton) {
        const dynamicQuestionIds = [...new Set(this._page.questions.map((q) => q.triggeredQuestions).flat())];
        this._page.questions.forEach((question) => {
            if (question.type === QuestionTypes.Info || dynamicQuestionIds.includes(question.id)) {
                return;
            }

            const button = $('<span class="cf-question__comments-button"></span>');
            $(`#${question.id}_text`).append(button);
            new CommentsButton(button[0], this._store, question.id);
        });
    }

    _initTestNavigator(TestNavigator) {
        new TestNavigator(this._page.testNavigator, this._store);
    }

    _initCommentsPanel(CommentsPanel) {
        $('html').addClass('cf-page-html-wrapper');
        $('.cf-page').addClass('cf-page--reviewing');
        $('.cf-page__header, .cf-page__main').wrapAll('<div class="cf-page__main-wrapper"></div>');
        const panel = $('<div class="cf-page__comments-panel"></div>');
        $('.cf-page__main-wrapper').after(panel);
        new CommentsPanel(panel[0], this._store);
    }
}
