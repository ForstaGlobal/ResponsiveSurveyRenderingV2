import $ from 'jquery';
import QuestionTypes from 'api/question-types.js';
import Utils from '../../utils';
import AnswerCodesUpdater from './answer-codes-updater/updater';

export default class SurveyReviewer {
    /**
     * @param {Page} page
     */
    constructor(page) {
        this._page = page;
        this._store = null;

        this._answerCodesUpdater = new AnswerCodesUpdater();

        this._init();
    }

    _init() {
        const isTestNavigatorEnabled = this._page.testNavigator !== null;
        const isCommentingEnabled = isTestNavigatorEnabled;

        if (!isTestNavigatorEnabled) {
            return;
        }

        this._page.dynamicQuestionsChangeCompleteEvent.on(this._initDynamicQuestionsCommenting.bind(this));

        import('@forsta/survey-reviewing-components').then(
            ({ configureAppStore, TestNavigator, CommentsPanel, CommentsButton }) => {
                this._initStore(configureAppStore);
                this._initTestNavigator(TestNavigator);
                if (isCommentingEnabled) {
                    this._initQuestionsCommenting(CommentsButton);
                    this._initQuestionAttributes();
                    this._initCommentsPanel(CommentsPanel);
                }
            }
        );
    }

    _initStore(configureAppStore) {
        const surveyId = this._page.surveyInfo.surveyId;
        const commentingEndpoint = this._page.testNavigator.commentingEndpoint;
        const authQueryString = this._page.testNavigator.authQueryString;

        const updateQuestionAttributesMiddleware = store => next => action => {
            const result = next(action);
            if (action.type === 'questionAttributes/toggle') {
                this._updateQuestionsAttributes(this._page.questions);
                this._writeQuestionAttributesToStorage(store.getState().questionAttributes);
            }
            return result;
        };

        this._store = configureAppStore(
            {
                testNavigatorQuestions: this._page.testNavigator.questions.map(question => ({
                    id: question.id,
                    entityId: question.entityId,
                    type: question.type,
                    title: question.title,
                    link: question.link,
                })),
                surveyId: surveyId,
                endpoint: commentingEndpoint,
                authQueryString: authQueryString,
                questionAttributes: this._getQuestionAttributes(),
            },
            [updateQuestionAttributesMiddleware]
        );
    }

    _initQuestionsCommenting(CommentsButton) {
        this._page.questions.forEach(question => {
            if (question.type === QuestionTypes.DynamicQuestionPlaceholder) {
                return;
            }

            this._renderCommentsButton(question, CommentsButton);
        });
    }

    _initDynamicQuestionsCommenting() {
        import('@forsta/survey-reviewing-components').then(({ CommentsButton }) => {
            this._page.questions.forEach(question => {
                if (question.type === QuestionTypes.DynamicQuestionPlaceholder) {
                    return;
                }

                this._renderCommentsButton(question, CommentsButton);
            });
        });
    }

    _renderCommentsButton(question, CommentsButton) {
        const questionTextContainer = $(`#${question.id}_text`);
        if (questionTextContainer.children('.cf-question__comments-button').length) {
            return;
        }

        const commentsButtonContainer = $('<span class="cf-question__comments-button"></span>');
        questionTextContainer.append(commentsButtonContainer);

        new CommentsButton(commentsButtonContainer[0], this._store, question.entityId);
    }

    _initTestNavigator(TestNavigator) {
        const testNavigatorNode = $('<div style="visibility: visible;"></div>');
        $('body').append(testNavigatorNode);
        new TestNavigator(testNavigatorNode[0], this._page, this._store);
    }

    _initCommentsPanel(CommentsPanel) {
        $('html').addClass('cf-page-html-wrapper');
        $('.cf-page').addClass('cf-page--reviewing');
        $('.cf-page__header, .cf-page__main').wrapAll('<div class="cf-page__main-wrapper"></div>');
        const panel = $('<div class="cf-page__comments-panel"></div>');
        $('.cf-page__main-wrapper').after(panel);
        new CommentsPanel(panel[0], this._store, this._page.questions);
    }

    _initQuestionAttributes() {
        // Dynamic
        this._page.dynamicQuestionsChangeCompleteEvent.on(questions => {
            // TODO: RR V3: remove setTimeout after update DynamicQuestionsManager.
            setTimeout(() => {
                this._updateQuestionsAttributes(questions);
            }, 0);
        });

        // Initial update
        this._updateQuestionsAttributes(this._page.questions);
    }

    _getQuestionAttributes() {
        const storageQuestionAttributes = this._readQuestionAttributesFromStorage();
        return {
            displayId: this._page.testNavigator.displayQuestionId,
            displayCategory: this._page.testNavigator.displayQuestionCategory,
            displayMasking: this._page.testNavigator.displayQuestionMasking,
            displayNotRequired: this._page.testNavigator.displayQuestionNotRequired,
            displayAnswerCodes: this._page.testNavigator.displayAnswerCodes,
            ...storageQuestionAttributes,
        };
    }

    _readQuestionAttributesFromStorage() {
        const storageValue = sessionStorage.getItem('sr:test-navigator-question-attributes');
        if (storageValue === null) return undefined;

        try {
            return JSON.parse(storageValue);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Read question attributes from local storage.', error);
            return undefined;
        }
    }

    _writeQuestionAttributesToStorage(questionAttributes) {
        sessionStorage.setItem('sr:test-navigator-question-attributes', JSON.stringify(questionAttributes));
    }

    _updateQuestionsAttributes(questions) {
        questions.forEach(question => {
            this._updateQuestionAttributes(question);
            this._updateAnswerCodes(question);
        });
    }

    _updateQuestionAttributes(question) {
        const { displayId, displayCategory, displayMasking, displayNotRequired } =
            this._store.getState().questionAttributes;
        $(`#${question.id}`).find('.sr-question-attribute').remove();

        const questionMasking = this._getQuestionMasking(question.id);
        if (questionMasking) {
            this._updateQuestionAttribute(
                question.id,
                `${question.id}_attr_scale_mask`,
                `[Scale mask: ${questionMasking.scalePrecodeMask}]`,
                displayMasking && !Utils.isEmpty(questionMasking.scalePrecodeMask)
            );
            this._updateQuestionAttribute(
                question.id,
                `${question.id}_attr_code_mask`,
                `[Code mask: ${questionMasking.precodeMask}]`,
                displayMasking && !Utils.isEmpty(questionMasking.precodeMask)
            );
            this._updateQuestionAttribute(
                question.id,
                `${question.id}_attr_question_mask`,
                `[Question mask: ${questionMasking.questionMask}]`,
                displayMasking && !Utils.isEmpty(questionMasking.questionMask)
            );
        }

        this._updateQuestionAttribute(
            question.id,
            `${question.id}_attr_category`,
            `[Question category: ${question.category}]`,
            displayCategory && !Utils.isEmpty(question.category)
        );
        this._updateQuestionAttribute(
            question.id,
            `${question.id}_attr_id`,
            `[Question ID: ${question.id}]`,
            displayId
        );
        this._updateQuestionAttribute(
            question.id,
            `${question.id}_attr_not-required`,
            `[Not required]`,
            displayNotRequired && question?.required === false
        );
    }

    _updateQuestionAttribute(questionId, id, text, display) {
        if (display) {
            $(`#${questionId}_text`).prepend(`<div id="${id}" class="sr-question-attribute">${text}</div>`);
        }
    }

    _updateAnswerCodes(question) {
        const { displayAnswerCodes } = this._store.getState().questionAttributes;
        this._answerCodesUpdater.update(question, displayAnswerCodes);
    }

    _getQuestionMasking(questionId) {
        // TODO: potentially these info should be got from RR question model instead of TestNavigator question model.
        const question = this._page.testNavigator.questions.find(question => question.id === questionId);

        //if survey is completed
        if (!question) {
            return;
        }

        return {
            questionMask: question.questionMask,
            precodeMask: question.precodeMask,
            scalePrecodeMask: question.scalePrecodeMask,
        };
    }
}
