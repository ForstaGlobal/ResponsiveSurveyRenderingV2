import QuestionWithAnswersView from 'views/questions/base/question-with-answers-view.js'
import HorizontalSlider from 'views/controls/slider/horizontal-slider.js';
import HorizontalRtlSlider from 'views/controls/slider/horizontal-rtl-slider.js';
import FloatingPanel from "../controls/floating-panel";
import ValidationTypes from "../../api/models/validation/validation-types";

export default class SliderGridQuestionView extends QuestionWithAnswersView {
    /**
     * @param {GridQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);

        this._sliders = new Map();
        this._floatingPanel = null;

        this._init();
    }

    detach(){
        super.detach();
        this._sliders.forEach(slider => slider.detach());
        this._floatingPanel.detach();
    }

    _init() {
        const sliderValues = this._question.scales.map(scale => scale.code);
        const sliderTextValueHandler = (sliderValue) => {
            return sliderValue === null ? this._settings.messages.noResponse : this._question.getScale(sliderValue).text;
        };

        this._question.answers.forEach(answer => {
            const sliderNode = this._getAnswerInputNodeId(answer.code);
            const sliderValue = this._question.values[answer.code] || null;
            const slider = this._createSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler);
            slider.changeEvent.on(() => {
                this._question.setValue(answer.code, slider.value);
            });
            slider.moveEvent.on(value => this._handleScaleColor(slider, value));
            this._sliders.set(answer.code, slider);

            if (answer.isOther) {
                this._getAnswerOtherNode(answer.code)
                    .on('keydown', e => e.stopPropagation())
                    .on('input', event => this._onAnswerOtherNodeValueChange(answer, event.target.value));
            }

            this._handleScaleColor(slider, slider.value);
        });

        this._initFloatingLabels();
    }

    _initFloatingLabels() {
        const panelNode = this._container.find('.cf-slider-grid-answer--fake-for-panel .cf-floating-panel');
        const lastItemNode = this._container.find('.cf-slider-grid-answer').last();
        this._floatingPanel = new FloatingPanel(panelNode, lastItemNode, this._settings.mobileThreshold);
    }

    _createSlider(sliderNode, sliderValues, sliderValue, textValueHandler) {
        const readOnly = this._question.readOnly;

        if (this._question.isRtl) {
            return new HorizontalRtlSlider(sliderNode, sliderValues, sliderValue, textValueHandler, false, readOnly);
        }

        return new HorizontalSlider(sliderNode, sliderValues, sliderValue, textValueHandler, false, readOnly);
    }

    _updateSliders({values = []}) {
        if (values.length === 0)
            return;

        values.forEach(answerCode => {
            this._sliders.get(answerCode).value = this._question.values[answerCode] || null;
        });
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
    }

    _hideErrors() {
        super._hideErrors();

        this._container.find('.cf-text-box')
            .removeAttr('aria-errormessage')
            .removeAttr('aria-invalid');
    }

    _onModelValueChange({changes}) {
        this._updateSliders(changes);
        this._updateAnswerOtherNodes(changes);
    }

    _onAnswerOtherNodeValueChange(answer, value) {
        this._question.setOtherValue(answer.code, value);
    }

    _handleScaleColor(slider, value) {
        slider.handleNode.css('background-color', '');

        if (value) {
            const scaleColor = this._question.scales.find(scale => scale.code === value).backgroundColor;
            if (scaleColor) {
                slider.handleNode.css('background-color', scaleColor);
            }
        }
    }
}