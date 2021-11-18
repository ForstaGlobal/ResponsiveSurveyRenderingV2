import Grid3DDesktopInnerQuestionView from "./grid-3d-desktop-inner-question-view";
import HorizontalSlider from "../../../controls/slider/horizontal-slider";
import HorizontalRtlSlider from "../../../controls/slider/horizontal-rtl-slider";

export default class Grid3DDesktopInnerSliderGridQuestionView extends Grid3DDesktopInnerQuestionView {
    constructor(parentQuestion, question, settings = null) {
        super(parentQuestion, question, settings);

        this._sliders = new Map();

        this._init();
    }

    detach() {
        super.detach()

        for (let slider of this._sliders.values()) {
            slider.detach();
        }
    }

    _init() {
        const sliderValues = this._question.scales.map(scale => scale.code);
        const sliderTextValueHandler = (sliderValue) => {
            return sliderValue === null ? this._settings.messages.noResponse : this._question.getScale(sliderValue).text;
        };

        this._question.answers.forEach(answer => {
            const sliderNode = this._idProvider.getAnswerControlNodeId(answer.code);
            const sliderValue = this._question.values[answer.code] || null;
            const slider = this._createSlider(sliderNode, sliderValues, sliderValue, sliderTextValueHandler);
            slider.changeEvent.on(() => {
                this._question.setValue(answer.code, slider.value);
            });
            slider.moveEvent.on(value => this._handleScaleColor(slider, value));
            this._sliders.set(answer.code, slider);

            this._handleScaleColor(slider, slider.value);
        });
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

    _onModelValueChange({changes}) {
        this._updateSliders(changes);
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