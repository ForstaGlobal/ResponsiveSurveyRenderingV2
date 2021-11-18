import StarRatingGridQuestionViewBase from "./star-rating-grid/star-rating-grid-question-view-base"
import questionHelper from 'views/helpers/question-helper.js';
import Carousel from "../controls/carousel";
import CarouselItem from '../controls/carousel-item.js';
import Utils from '../../utils.js';
import KEYS from "../helpers/keyboard-keys";

export default class CarouselStarRatingGridQuestionView extends StarRatingGridQuestionViewBase {
    /**
     * @param {GridRatingQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);

        this._carouselItems = this._question.answers.map(answer =>
            new CarouselItem(this._getCarouselItemId(answer.code), !Utils.isEmpty(this._question.values[answer.code])));
        this._carousel = new Carousel(this._container.find('.cf-carousel'), this._carouselItems);
        this._carousel.moveEvent.on(() => this._onCarouselMove());
        this._moveToFirstError = true;

        /** @override **/
        this._currentAnswerIndex = this._carousel.currentItemIndex;
    }

    _getCarouselItemId(answerCode) {
        return this._getAnswerNodeId(answerCode);
    }

    _getClickableScaleNode(answer, scale) {
        if(this._isItemInScale(scale.code)) {
            return this._getScaleControlNode(answer.code, scale.code);
        }
        return this._getScaleNode(answer.code, scale.code);
    }

    _getSelectedControlClass(scaleCode) {
        return this._isItemInScale(scaleCode) ? "cf-star-rating-item--selected" : "cf-radio--selected";
    }

    _attachToDOM() {
        super._attachToDOM();

        if (!this._settings.disableKeyboardSupport) {
            this._container.on('keydown', this._onQuestionContainerKeyDown.bind(this));
        }
    }

    _updateAnswerScaleNodes({values = []}) {
        if (values.length === 0)
            return;

        super._updateAnswerScaleNodes({values});

        values.forEach(answerCode => {
            this._scales
                .filter(scale => !this._isItemInScale(scale.code))
                .forEach(scale => this._getScaleNode(answerCode, scale.code).removeClass('cf-radio-answer--selected'));

            const scaleCode = this._question.values[answerCode];
            if(!this._isItemInScale(scaleCode)) {
                this._getScaleNode(answerCode, scaleCode).addClass('cf-radio-answer--selected');
            }
        });
    }

    _showErrors(validationResult) {
        const invalidAnswerValidationResults = validationResult.answerValidationResults.filter(result => !result.isValid);

        // update carousel paging state
        if (invalidAnswerValidationResults.length > 0) {
            const answersWithError = invalidAnswerValidationResults.map(result => this._getCarouselItemId(result.answerCode));
            this._carouselItems.forEach(item => item.isError = answersWithError.includes(item.id));
        }

        // accessible flow
        if(this._settings.isAccessible) {
            this._accessibleShowErrors(validationResult);
            return;
        }

        //standard flow
        super._showErrors(validationResult);

        if (invalidAnswerValidationResults.length > 0) {
            let currentPageValidationResult = invalidAnswerValidationResults.find(result => this._getCarouselItemId(result.answerCode) === this._carousel.currentItem.id);
            if (!currentPageValidationResult && this._moveToFirstError) {
                const index = this._carouselItems.findIndex(item => item.isError);
                if (index !== -1) {
                    this._carousel.moveToItemByIndex(index);
                }
            }

            if (currentPageValidationResult) {
                const currentPageOtherError = currentPageValidationResult.errors.find(error => error.type === 'OtherRequired');
                if (currentPageOtherError) {
                    // have to wait transition end; don't want to subscribe on transitionend event.
                    setTimeout(() => this._getAnswerOtherNode(this._carousel.currentItem.id).focus(), 500);
                }
            }

            this._moveToFirstError = false;
        } else {
            this._moveToFirstError = true;
        }
    }

    _accessibleShowErrors(validationResult) {
        const invalidAnswerValidationResults = validationResult.answerValidationResults.filter(result => !result.isValid);

        if (invalidAnswerValidationResults.length === 0) {
            return;
        }

        const currentPageValidationResult = invalidAnswerValidationResults.find(result => this._getCarouselItemId(result.answerCode) === this._carousel.currentItem.id);
        if (!currentPageValidationResult) {
            const index = this._carouselItems.findIndex(item => item.isError);
            if (index !== -1) {
                this._carousel.moveToItemByIndex(index);
                setTimeout(() => super._showErrors(validationResult), 500);
            }
        } else {
            super._showErrors(validationResult);
        }
    }

    _hideErrors() {
        super._hideErrors();
        this._carouselItems.forEach(item => item.isError = false);
    }

    _updateCarouselComplete() {
        this._question.answers.forEach((answer, answerIndex) => {
            const carouselItem = this._carouselItems[answerIndex];
            if (answer.isOther) {
                carouselItem.isComplete = this._question.values[answer.code] !== undefined && this._question.otherValues[answer.code] !== undefined;
            } else {
                carouselItem.isComplete = this._question.values[answer.code] !== undefined;
            }
        });
    }

    _autoMoveNext(changes, currentItemIsCompleteBefore) {
        if (this._settings.isAccessible) {
            return;
        }

        const otherIsChanged = changes.otherValues !== undefined;
        const answerCompleteStatusIsChangedToComplete = this._carousel.currentItem.isComplete === true && this._carousel.currentItem.isComplete !== currentItemIsCompleteBefore;
        if (answerCompleteStatusIsChangedToComplete && !otherIsChanged) {
            this._carousel.moveNext();
        }
    }

    _selectScale(answer, scale) {
        this._question.setValue(answer.code, scale.code);

        if (answer.isOther && Utils.isEmpty(this._question.otherValues[answer.code])) {
            this._getAnswerOtherNode(answer.code).focus();
        }
    }

    _onModelValueChange({changes}) {
        super._onModelValueChange({changes});

        const currentCarouselItemIsCompleteBefore = this._carousel.currentItem.isComplete;
        this._updateCarouselComplete();
        this._autoMoveNext(changes, currentCarouselItemIsCompleteBefore);
    }

    _onScaleNodeClick(event, answer, scale) {
        this._selectScale(answer, scale);
    }

    _onQuestionContainerKeyDown(event) {
        if (event.shiftKey || event.keyCode !== KEYS.Tab) {
            return;
        }
        const activeElement = window.document.activeElement;
        if (activeElement === undefined) {
            return;
        }

        const isLastAnswer = this._currentAnswerIndex === this._answers.length - 1;
        const nextButtonIsFocused = activeElement.classList.contains('cf-carousel__navigation-button--next');
        const scaleItemIsFocused = activeElement.classList.contains('cf-star-rating-item') || activeElement.classList.contains('cf-radio');

        if (isLastAnswer && nextButtonIsFocused && this._currentAnswer.isOther) {
            event.preventDefault();
            event.stopPropagation();
            this._getAnswerOtherNode(this._currentAnswer.code).focus();
            return;
        }

        if (!isLastAnswer && scaleItemIsFocused) {
            event.preventDefault();
            event.stopPropagation();
            if (this._currentAnswer.isOther) {
                this._getAnswerOtherNode(this._currentAnswer.code).focus();
            } else {
                this._container.find('.cf-carousel__navigation-button--next').focus();
            }
            return;
        }
    }

    _onAnswerOtherNodeKeyDown(event, answer) {
        if (event.keyCode === KEYS.Tab) {
            return;
        }

        event.stopPropagation();

        if (event.keyCode === KEYS.Enter && questionHelper.isAnswerComplete(this._question, answer)) {
            this._carousel.moveNext();
            event.preventDefault();
        }
    }

    _onCarouselMove() {
        this._currentAnswerIndex = this._carousel.currentItemIndex;
    }
}