import QuestionWithAnswersView from './base/question-with-answers-view.js';
import VerticalSlider from '../controls/slider/vertical-slider';
import HorizontalRtlSlider from '../controls/slider/horizontal-rtl-slider';
import HorizontalSlider from '../controls/slider/horizontal-slider';
import Utils from '../../utils';
import StoredOtherValuesMixin from './base/stored-other-values-mixin';
import { SingleOtherValuesKeeper } from '../helpers/other-values-keeper';

export default class SliderSingleQuestionView extends QuestionWithAnswersView {
    /**
     * @param {SingleQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);

        this._slider = this._createSlider();
        this._slider.changeEvent.on(this._onSliderChange.bind(this));
        this._slider.moveEvent.on((value) => this._handleAnswerColors(value));

        this._handleAnswerColors(this._slider.value);
        this._attachHandlersToDOM();
    }

    detach() {
        super.detach();
        this._slider.detach();
    }

    _attachHandlersToDOM() {
        this._question.answers.forEach((answer) => {
            this._getAnswerTextNode(answer.code).on('click', () => {
                this._question.setValue(answer.code);
            });

            if (answer.isOther) {
                const otherInput = this._getAnswerOtherNode(answer.code);
                otherInput.on('click', (e) => e.stopPropagation());
                otherInput.on('keydown', (e) => e.stopPropagation());
                otherInput.on('input', (e) => this._onAnswerOtherNodeValueChange(answer, e.target.value));
            }
        });
    }

    _createSlider() {
        const sliderNode = this._getQuestionInputNodeId();
        const sliderValues = this._question.answers.map((answer) => answer.code);
        const sliderValue = this._question.value;
        const readOnly = this._question.readOnly;
        const sliderTextValueHandler = (sliderValue) => {
            return sliderValue === null
                ? this._settings.messages.noResponse
                : this._question.getAnswer(sliderValue).text;
        };

        if (this._question.sliderIsVertical) {
            return new VerticalSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler, false, readOnly);
        }

        if (this._question.isRtl) {
            return new HorizontalRtlSlider(
                sliderNode,
                sliderValues,
                sliderValue,
                sliderTextValueHandler,
                false,
                readOnly
            );
        }

        return new HorizontalSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler, false, readOnly);
    }

    _handleAnswerColors(value) {
        this._slider.handleNode.css('background-color', '');

        if (value) {
            const answerColor = this._question.answers.find((answer) => answer.code === value).backgroundColor;
            if (answerColor) {
                this._slider.handleNode.css('background-color', answerColor);
            }
        }
    }

    _selectAnswer(answerCode) {
        this._question.setValue(answerCode);

        this._container
            .find('.cf-single-slider-question__answer-text')
            .removeClass('cf-single-slider-question__answer-text--selected');
        this._getAnswerTextNode(this._slider.value).addClass('cf-single-slider-question__answer-text--selected');
    }

    _onModelValueChange({ changes }) {
        this._slider.value = this._question.value;
        this._updateAnswerOtherNodes(changes);
    }

    _onSliderChange() {
        this._selectAnswer(this._slider.value);
    }

    _onAnswerOtherNodeValueChange(answer, otherValue) {
        if (!Utils.isEmpty(otherValue)) {
            this._question.setValue(answer.code);
        }

        if (this._question.value === answer.code) {
            this._question.setOtherValue(answer.code, otherValue);
        }
    }

    _showErrors(validationResult) {
        let errors = validationResult.errors.map((error) => error.message);

        const otherAnswerCodes = this.answers.filter((answer) => answer.isOther).map((answer) => answer.code);
        validationResult.answerValidationResults
            .filter((result) => !result.isValid && otherAnswerCodes.includes(result.answerCode))
            .forEach((answerValidationResult) => {
                const answerErrors = answerValidationResult.errors.map((error) => error.message);
                this._showAnswerOtherValidationError(answerValidationResult);

                errors = errors.concat(answerErrors);
            });

        this._addQuestionErrorModifier();
        this._questionErrorBlock.showErrors(errors);
    }

    _showAnswerOtherValidationError(answerValidationResult) {
        const otherNode = this._getAnswerOtherNode(answerValidationResult.answerCode);
        otherNode
            .addClass('cf-text-box--error')
            .attr('aria-errormessage', this._getQuestionErrorNodeId())
            .attr('aria-invalid', 'true');
    }

    _hideErrors() {
        super._hideErrors();
        this.answers
            .filter((answer) => answer.isOther)
            .forEach((answer) => {
                this._getAnswerOtherNode(answer.code)
                    .removeClass('cf-text-box--error')
                    .removeAttr('aria-errormessage')
                    .removeAttr('aria-invalid');
            });
    }
}

export class SliderSingleQuestionViewWithStoredOtherValues extends StoredOtherValuesMixin(SliderSingleQuestionView) {
    constructor(question, settings) {
        super(question, settings, new SingleOtherValuesKeeper(question, settings));
    }
}
