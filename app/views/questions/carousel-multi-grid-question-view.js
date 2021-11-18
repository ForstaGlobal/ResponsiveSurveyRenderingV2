import QuestionView from './base/question-view';
import Carousel from '../controls/carousel.js';
import CarouselItem from '../controls/carousel-item.js';
import ErrorBlockManager from '../error/error-block-manager';
import Utils from '../../utils';
import KEYS from '../helpers/keyboard-keys';
import MultiGridQuestionHelper from '../helpers/multi-grid-question-helper';
import QuestionIdProvider from '../helpers/question-id-provider';
import $ from 'jquery';

export default class CarouselMultiGridQuestionView extends QuestionView {
    /**
     * @param {Grid3DQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);

        this._answerErrorBlockManager = new ErrorBlockManager();

        this._carouselItems = this._question.innerQuestions.map(question => new CarouselItem(question.id, question.values.length > 0));
        this._carousel = new Carousel(this._container.find('.cf-carousel'), this._carouselItems);
        this._carousel.moveEvent.on(() => this._onCarouselMove());
        this._moveToFirstError = true;

        this._currentQuestionIndex = this._carousel.currentItemIndex;
        this._currentAnswerIndex = null;

        this._mgHelper = new MultiGridQuestionHelper(questionId => new QuestionIdProvider(questionId));

        this._attachHandlersToDOM();
    }

    get _currentQuestion() {
        return this._question.innerQuestions[this._currentQuestionIndex] || null;
    }

    get _currentAnswer() {
        return this._question.answers[this._currentAnswerIndex] || null;
    }

    _getAnswerOtherNode(answerCode) {
        return this._idProvider.getAnswerOtherNode(answerCode);
    }

    _getOtherNodes(answerCode) {
        return this._container.find(this._question.innerQuestions.map(question => '#' + this._mgHelper.getInnerQuestionAnswerOtherNodeId(question.id, answerCode)).join(','));
    }

    _getCarouselItem(questionId) {
        return this._carouselItems.find(item => item.id === questionId);
    }

    _getSelectedControlClass(answer) {
        if (answer.imagesSettings !== null) {
            return 'cf-image--selected';
        }

        return 'cf-button--selected';
    }

    _getSelectedAnswerClass(answer) {
        if (answer.imagesSettings !== null) {
            return 'cf-image-answer--selected';
        }

        return 'cf-button-answer--selected';
    }

    _attachHandlersToDOM() {
        this._question.innerQuestions.forEach((question) => {
            question.answers.forEach((answer) => {
                this._mgHelper.getInnerQuestionAnswerNode(question.id, answer.code)
                    .on('click', this._onAnswerNodeClick.bind(this, question, answer))
            });
        });

        this._question.answers.filter(answer => answer.isOther).forEach(answer => {
            this._question.innerQuestions.forEach(question => {
                this._mgHelper.getInnerQuestionAnswerOtherNode(question.id, answer.code)
                    .on('click', e => e.stopPropagation())
                    .on('input', event => {
                        this._onQuestionAnswerOtherNodeValueChange(question, answer, event.target.value)
                    });
            });
        });

        if (!this._settings.disableKeyboardSupport) {
            this._container.on('keydown', this._onQuestionContainerKeyDown.bind(this));

            this._question.innerQuestions.forEach((question, questionIndex) => {
                question.answers.forEach((answer, answerIndex) => {
                    this._mgHelper.getInnerQuestionAnswerControlNode(question.id, answer.code)
                        .on('focus', this._onAnswerControlNodeFocus.bind(this, questionIndex, answerIndex))
                        .on('keydown', this._onAnswerControlNodeKeyDown.bind(this));
                });
            });

            this._question.answers.filter(answer => answer.isOther).forEach(answer => {
                this._question.innerQuestions.forEach(question => {
                    this._mgHelper.getInnerQuestionAnswerOtherNode(question.id, answer.code)
                        .on('keydown', this._onAnswerOtherNodeKeyDown.bind(this))
                });
            });
        }
    }

    _updateQuestionAnswerNodes({questions = {}}) {
        Object.entries(questions).forEach(([questionId, {values = []}]) => {
            if (values.length === 0) {
                return;
            }

            values.forEach(value => {
                const answer = this._question.getAnswer(value);
                const isSelected = this._question.getInnerQuestion(questionId).values.includes(answer.code);

                const controlNode = this._mgHelper.getInnerQuestionAnswerControlNode(questionId, answer.code);
                const answerNode = this._mgHelper.getInnerQuestionAnswerNode(questionId, answer.code)

                answerNode.toggleClass(this._getSelectedAnswerClass(answer), isSelected);

                controlNode
                    .toggleClass(this._getSelectedControlClass(answer), isSelected)
                    .attr('aria-checked', () => isSelected ? 'true' : 'false');

                if (answer.backgroundColor !== null) {
                    if (isSelected) {
                        controlNode.css({backgroundColor: answer.backgroundColor, borderColor: answer.backgroundColor});
                    } else {
                        controlNode.css({backgroundColor: '', borderColor: ''});
                    }
                }
            });
        });
    }

    _updateAnswerOtherNodes({questions = {}, otherValues = []}) {
        Object.entries(questions).forEach(([questionId, {values = []}]) => {
            if (values.length === 0) {
                return;
            }

            values.forEach(answerCode => {
                const isSelected = this._question.getInnerQuestion(questionId).values.includes(answerCode);
                this._mgHelper.getInnerQuestionAnswerOtherNode(questionId, answerCode)
                    .attr('tabindex', isSelected ? '0' : '-1')
                    .attr('aria-hidden', isSelected ? 'false' : 'true');
            });
        });

        otherValues.forEach(answerCode => {
            const otherValue = this._question.otherValues[answerCode];
            this._setOtherNodeValue(answerCode, otherValue);
        });
    }

    _updateCarouselPaging() {
        this._question.innerQuestions.forEach(question => {
            const carouselItem = this._getCarouselItem(question.id);
            const selectedAnswersWithOther = this._question.answers.filter(answer => answer.isOther && question.values.includes(answer.code));
            if (selectedAnswersWithOther.length !== 0) {
                carouselItem.isComplete = selectedAnswersWithOther.every(answer => this._question.otherValues[answer.code] !== undefined);
            } else {
                carouselItem.isComplete = question.values.length !== 0;
            }
        });
    }

    _setOtherNodeValue(answerCode, otherValue) {
        otherValue = otherValue || '';

        const otherNodes = this._getOtherNodes(answerCode).filter((index, node) => $(node).val() !== otherValue);
        otherNodes.val(otherValue);
    }

    _hideErrors() {
        super._hideErrors();

        this._carouselItems.forEach(item => item.isError = false);
        this._answerErrorBlockManager.removeAllErrors();

        this._container.find('.cf-list')
            .removeAttr('aria-invalid')
            .removeAttr('aria-errormessage');

        this._container.find('.cf-text-box')
            .removeAttr('aria-errormessage')
            .removeAttr('aria-invalid');
    }

    _showErrors(validationResult) {
        this._updateCarouselPagingItemsErrorState(validationResult);

        super._showErrors(validationResult);

        const questionWithError = validationResult.questionValidationResults.some(result => !result.isValid);
        const answerWithError = validationResult.answerValidationResults.some(result => !result.isValid);
        if (questionWithError || answerWithError) {
            this._moveToFirstQuestionWithError();

            if (this._settings.isAccessible && !this._carousel.currentItem.isError) {
                setTimeout(() => {
                    this._showInnerQuestionErrors(validationResult);
                    this._showAnswerOtherError(validationResult);
                }, 500);
            } else {
                this._showInnerQuestionErrors(validationResult);
                this._showAnswerOtherError(validationResult);
            }
        }
    }

    _updateCarouselPagingItemsErrorState(validationResult) {
        validationResult.questionValidationResults.forEach(questionValidationResult => {
            const item = this._getCarouselItem(questionValidationResult.questionId);
            item.isError = !questionValidationResult.isValid;
        });

        validationResult.answerValidationResults.forEach(answerValidationResult => {
            const answer = this._question.getAnswer(answerValidationResult.answerCode);
            if (!answer.isOther) {
                return;
            }

            this._question.innerQuestions.forEach(question => {
                if (!question.values.includes(answer.code)) {
                    return;
                }

                this._getCarouselItem(question.id).isError = true;
            });
        });
    }

    _moveToFirstQuestionWithError() {
        // if ACC id enabled, have to force move to first error question with error.
        if (this._settings.isAccessible) {
            this._moveToFirstError = true;
        }

        if (!this._carousel.currentItem.isError && this._moveToFirstError) {
            const index = this._carouselItems.findIndex(item => item.isError);
            if (index !== -1) {
                this._carousel.moveToItemByIndex(index);
            }
        }

        this._moveToFirstError = false;
    }

    _showInnerQuestionErrors(validationResult) {
        validationResult.questionValidationResults.filter(result => !result.isValid).forEach(questionValidationResult => {
            const target = this._mgHelper.getInnerQuestionTextNode(questionValidationResult.questionId);
            const errorBlockId = this._mgHelper.getInnerQuestionErrorNodeId(questionValidationResult.questionId);
            const errors = questionValidationResult.errors.map(error => error.message);
            this._answerErrorBlockManager.showErrors(errorBlockId, target, errors);

            this._mgHelper.getInnerQuestionNode(questionValidationResult.questionId).find('.cf-list')
                .attr('aria-invalid', 'true')
                .attr('aria-errormessage', errorBlockId);
        });
    }

    _showAnswerOtherError(validationResult) {
        validationResult.answerValidationResults
            .filter(answerValidationResult => this._question.getAnswer(answerValidationResult.answerCode).isOther)
            .forEach(answerValidationResult => {
                this._question.innerQuestions
                    .filter(question => question.values.includes(answerValidationResult.answerCode))
                    .forEach(question => {
                        const target = this._mgHelper.getInnerQuestionTextNode(question.id);
                        const errorBlockId = this._mgHelper.getInnerQuestionErrorNodeId(question.id);
                        const errors = answerValidationResult.errors.map(error => error.message);
                        this._answerErrorBlockManager.showErrors(errorBlockId, target, errors);

                        this._mgHelper.getInnerQuestionAnswerOtherNode(question.id, answerValidationResult.answerCode)
                            .attr('aria-errormessage', errorBlockId)
                            .attr('aria-invalid', 'true');
                    });
            });
    }

    _toggleAnswer(question, answer) {
        const willBeChecked = !this._question.getInnerQuestion(question.id).values.includes(answer.code);
        this._question.getInnerQuestion(question.id).setValue(answer.code, willBeChecked);

        const otherInput = this._mgHelper.getInnerQuestionAnswerOtherNode(question.id, answer.code);
        if (answer.isOther && Utils.isEmpty(otherInput.val())) {
            otherInput.focus();
        }
    }

    _onModelValueChange({changes}) {
        this._updateQuestionAnswerNodes(changes);
        this._updateAnswerOtherNodes(changes);
        this._updateCarouselPaging();
    }

    _onAnswerNodeClick(question, answer) {
        this._toggleAnswer(question, answer);
    }

    _onQuestionAnswerOtherNodeValueChange(question, answer, value) {
        if (!Utils.isEmpty(value)) {
            this._question.getInnerQuestion(question.id).setValue(answer.code, true);
        }

        this._question.setOtherValue(answer.code, value);
    }

    _onCarouselMove() {
        this._currentQuestionIndex = this._carousel.currentItemIndex;
    }

    _onAnswerControlNodeFocus(questionIndex, answerIndex) {
        this._currentQuestionIndex = questionIndex;
        this._currentAnswerIndex = answerIndex;
    }

    _onQuestionContainerKeyDown(event) {
        if (event.shiftKey || event.keyCode !== KEYS.Tab) {
            return;
        }

        if (this._currentQuestionIndex === null || this._currentAnswerIndex === null) {
            return;
        }

        const activeElement = window.document.activeElement;
        if (activeElement === undefined) {
            return;
        }

        const isLastQuestion = this._currentQuestionIndex === this._question.innerQuestions.length - 1;
        const isLastAnswer = this._currentAnswerIndex === this._question.answers.length - 1;
        const answerControlIsFocused = activeElement.classList.contains('cf-button');
        const otherNodeIsFocused = activeElement.classList.contains('cf-button-answer__other-input');
        const lastAnswerIsSelected = this._question.getInnerQuestion(this._currentQuestion.id).values.includes(this._currentAnswer.code);

        if (isLastQuestion || !isLastAnswer) {
            return;
        }

        const jumpToNextButton = () => {
            event.preventDefault();
            event.stopPropagation();
            this._container.find('.cf-carousel__navigation-button--next').focus();
        };

        if (answerControlIsFocused && !this._currentAnswer.isOther) {
            jumpToNextButton();
            return;
        }
        if (answerControlIsFocused && this._currentAnswer.isOther && !lastAnswerIsSelected) {
            jumpToNextButton();
            return;
        }
        if (otherNodeIsFocused && this._currentAnswer.isOther) {
            jumpToNextButton();
            return;
        }
    }

    _onAnswerControlNodeKeyDown(event) {
        if ([KEYS.SpaceBar, KEYS.Enter].includes(event.keyCode) === false) {
            return;
        }

        if (this._currentQuestionIndex === null || this._currentAnswerIndex === null) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        this._toggleAnswer(this._currentQuestion, this._currentAnswer);
    }

    _onAnswerOtherNodeKeyDown(event) {
        if (event.keyCode === KEYS.Tab) {
            return;
        }

        event.stopPropagation();
    }
}