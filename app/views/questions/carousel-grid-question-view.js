import QuestionWithAnswersView from './base/question-with-answers-view.js';
import Utils from '../../utils.js';
import questionHelper from 'views/helpers/question-helper.js';
import Carousel from "../controls/carousel";
import CarouselItem from '../controls/carousel-item.js';
import KEYS from "../helpers/keyboard-keys";
import ValidationTypes from "../../api/models/validation/validation-types";

export default class CarouselGridQuestionView extends QuestionWithAnswersView {
    /**
     * @param {GridQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);

        this._scaleGroupCssClass = 'cf-list';

        this._carouselItems = this._question.answers.map(answer =>
            new CarouselItem(this._getCarouselItemId(answer.code), !Utils.isEmpty(this._question.values[answer.code])));
        this._carousel = new Carousel(this._container.find('.cf-carousel'), this._carouselItems);
        this._carousel.moveEvent.on(() => this._onCarouselMove());
        this._moveToFirstError = true;

        this._currentAnswerIndex = this._carousel.currentItemIndex;
        this._currentScaleIndex = null;

        this._attachControlHandlers();
    }

    get _answers() {
        return this._question.answers;
    }

    get _scales() {
        return this._question.scales;
    }

    get _currentAnswer() {
        return this._answers[this._currentAnswerIndex] || null;
    }

    get _currentScale() {
        return this._scales[this._currentScaleIndex] || null;
    }

    _getSelectedScaleClass(scale) {
        return scale.imagesSettings !== null ? 'cf-image-answer--selected' : 'cf-button-answer--selected';
    }

    _getSelectedControlClass(scale) {
        return scale.imagesSettings !== null ? 'cf-image--selected' : 'cf-button--selected';
    }

    _getCarouselItemId(answerCode) {
        return this._getAnswerNodeId(answerCode);
    }

    _attachControlHandlers() {
        this.answers.forEach((answer, answerIndex) => {
            this._scales.forEach((scale, scaleIndex) => {
                this._getScaleNode(answer.code, scale.code)
                    .click(() => this._onScaleNodeClick(answer, scale));
                this._getScaleControlNode(answer.code, scale.code)
                    .on('focus', this._onScaleControlNodeFocus.bind(this, answerIndex, scaleIndex))

            });

            if (answer.isOther) {
                this._getAnswerOtherNode(answer.code).on('input', event =>
                    this._onAnswerOtherValueChanged(answer.code, event.target.value));
            }
        });

        if (!this._settings.disableKeyboardSupport) {
            this._container.on('keydown', this._onQuestionContainerKeyDown.bind(this));

            this.answers.forEach((answer) => {
                this._getAnswerNode(answer.code).find(`.${this._scaleGroupCssClass}`)
                    .on('keydown', this._onGroupNodeKeyDown.bind(this));

                if (answer.isOther) {
                    this._getAnswerOtherNode(answer.code).on('keydown', event =>
                        this._onAnswerOtherValueKeyDown(answer, event));
                }

                this._scales.forEach(scale => {
                    this._getScaleControlNode(answer.code, scale.code)
                        .on('keydown', this._onScaleControlNodeKeyDown.bind(this));
                });
            });
        }
    }

    _showErrors(validationResult) {
        const invalidAnswerValidationResults = validationResult.answerValidationResults.filter(result => !result.isValid);

        // update carousel paging state
        if (invalidAnswerValidationResults.length > 0) {
            const answersWithError = invalidAnswerValidationResults.map(result => this._getCarouselItemId(result.answerCode));
            this._carouselItems.forEach(item => item.isError = answersWithError.includes(item.id));
        }

        // accessible flow
        if (this._settings.isAccessible) {
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

    _showAnswerError(validationResult) {
        const answer = this._question.getAnswer(validationResult.answerCode);
        const targetNode = answer.isOther
            ? this._getAnswerOtherNode(answer.code)
            : this._getAnswerTextNode(answer.code);
        const errorBlockId = this._getAnswerErrorBlockId(answer.code);
        const errors = validationResult.errors.map(error => error.message);
        this._answerErrorBlockManager.showErrors(errorBlockId, targetNode, errors);

        const otherErrors = validationResult.errors.filter(error => error.type === ValidationTypes.OtherRequired);
        if (otherErrors.length > 0) {
            this._getAnswerOtherNode(validationResult.answerCode)
                .attr('aria-errormessage', errorBlockId)
                .attr('aria-invalid', 'true');
        }

        const answerHasNotOnlyOtherErrors = validationResult.errors.length > otherErrors.length;
        if (answerHasNotOnlyOtherErrors) {
            this._getAnswerNode(answer.code).find(`.${this._scaleGroupCssClass}`)
                .attr("aria-invalid", "true")
                .attr("aria-errormessage", errorBlockId);
        }
    }

    _hideErrors() {
        super._hideErrors();
        this._carouselItems.forEach(item => item.isError = false);

        this._container.find(`.${this._scaleGroupCssClass}`)
            .removeAttr("aria-invalid")
            .removeAttr("aria-errormessage");

        this._container.find('.cf-text-box')
            .removeAttr('aria-errormessage')
            .removeAttr('aria-invalid');
    }

    _updateAnswerNodes({values = []}) {
        if (values.length === 0) {
            return;
        }

        values.forEach(answerCode => {
            // reset scales
            this._scales.forEach(scale => this._clearScaleNode(answerCode, scale.code));

            // update selected scale
            const scaleCode = this._question.values[answerCode];
            if (!Utils.isEmpty(scaleCode)) {
                this._selectScaleNode(answerCode, this._question.getScale(scaleCode));
            } else {
                this._getScaleControlNode(answerCode, this._scales[0].code).attr('tabindex', '0');
            }
        });
    }

    _updateCarouselComplete() {
        this._answers.forEach((answer, answerIndex) => {
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
    }

    _selectScaleNode(answerCode, scale) {
        this._getScaleNode(answerCode, scale.code)
            .addClass(this._getSelectedScaleClass(scale));

        const controlNode = this._getScaleControlNode(answerCode, scale.code);
        controlNode
            .addClass(this._getSelectedControlClass(scale))
            .attr('aria-checked', 'true')
            .attr('tabindex', '0');

        if (!Utils.isEmpty(scale.backgroundColor)) {
            controlNode.css({backgroundColor: scale.backgroundColor, borderColor: scale.backgroundColor});
        }
    }

    _clearScaleNode(answerCode, scaleCode) {
        const scale = this._question.getScale(scaleCode);

        this._getScaleNode(answerCode, scaleCode)
            .removeClass(this._getSelectedScaleClass(scale));

        this._getScaleControlNode(answerCode, scaleCode)
            .removeClass(this._getSelectedControlClass(scale))
            .attr('aria-checked', 'false')
            .attr('tabindex', '-1')
            .css('background-color', '')
            .css('border-color', '');
    }

    _onModelValueChange({changes}) {
        this._updateAnswerNodes(changes);
        this._updateAnswerOtherNodes(changes);

        const currentCarouselItemIsCompleteBefore = this._carousel.currentItem.isComplete;
        this._updateCarouselComplete();
        this._autoMoveNext(changes, currentCarouselItemIsCompleteBefore);
    }

    _onScaleNodeClick(answer, scale) {
        this._selectScale(answer, scale);

        if (this._settings.isAccessible) {
            return;
        }

        if (answer.isOther && Utils.isEmpty(this._question.otherValues[answer.code])) {
            this._getAnswerOtherNode(answer.code).focus();
        }
    }

    _onScaleControlNodeFocus(answerIndex, scaleIndex) {
        this._currentAnswerIndex = answerIndex;
        this._currentScaleIndex = scaleIndex;
    }

    _onAnswerOtherValueChanged(answerCode, otherValue) {
        this._question.setOtherValue(answerCode, otherValue);
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
        const scaleItemIsFocused = activeElement.classList.contains('cf-button');


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

    _onGroupNodeKeyDown(event) {
        if ([KEYS.ArrowUp, KEYS.ArrowLeft, KEYS.ArrowRight, KEYS.ArrowDown].includes(event.keyCode) === false) {
            return;
        }
        if (this._currentAnswerIndex === null || this._currentScaleIndex === null) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        let nextScale = null;
        switch (event.keyCode) {
            case KEYS.ArrowUp:
            case KEYS.ArrowLeft:
                if (this._currentScaleIndex > 0) {
                    nextScale = this._scales[this._currentScaleIndex - 1];
                } else {
                    nextScale = this._scales[this._scales.length - 1];
                }

                break;
            case KEYS.ArrowRight:
            case KEYS.ArrowDown:
                if (this._currentScaleIndex < this._scales.length - 1) {
                    nextScale = this._scales[this._currentScaleIndex + 1];
                } else {
                    nextScale = this._scales[0];
                }
                break;
        }

        this._selectScale(this._currentAnswer, nextScale);
        this._getScaleControlNode(this._currentAnswer.code, nextScale.code).focus();
    }

    _onScaleControlNodeKeyDown(event) {
        if ([KEYS.SpaceBar, KEYS.Enter].includes(event.keyCode) === false) {
            return;
        }

        if (this._currentAnswerIndex === null || this._currentScaleIndex === null) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        this._selectScale(this._currentAnswer, this._currentScale);
    }

    _onAnswerOtherValueKeyDown(answer, event) {
        if (event.keyCode === KEYS.Tab) {
            return;
        }

        event.stopPropagation();

        if (event.keyCode === KEYS.Enter && questionHelper.isAnswerComplete(this._question, answer)) {
            event.preventDefault();
            this._carousel.moveNext();
        }
    }

    _onCarouselMove() {
        this._currentAnswerIndex = this._carousel.currentItemIndex;
    }
}