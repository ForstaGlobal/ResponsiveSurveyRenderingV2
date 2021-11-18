import Question from './../base/question.js';
import ValidationTypes from '../validation/validation-types.js';
import RuleValidationResult from '../validation/rule-validation-result.js';
import Utils from 'utils.js';

/**
 * @extends {Question}
 */
export default class NumericQuestion extends Question {
    /**
     * Create instance.
     * @param {object} model - The instance of the model.
     */
    constructor(model) {
        super(model);

        this._numeric = { ...model.numeric };
        this._slider = model.slider || false;
        this._sliderIsVertical = model.sliderIsVertical || false;

        this._value = model.value || null;
    }

    /**
     * Numeric value.
     * @type {string}
     * @readonly
     */
    get value() {
        return this._value;
    }

    /**
     * `{max:value, min:value, precision:value, scale:value}`
     * @type {object}
     * @readonly
     */
    get numeric() {
        return { ...this._numeric };
    }

    /**
     * @inheritDoc
     */
    get formValues() {
        let form = {};
        if (!Utils.isEmpty(this.value)) form[this.id] = this.value;

        return form;
    }

    /**
     * Is it slider.
     * @type {boolean}
     * @readonly
     */
    get slider() {
        return this._slider;
    }

    /**
     * Is slider vertical.
     * @type {boolean}
     * @readonly
     */
    get sliderIsVertical() {
        return this._sliderIsVertical;
    }

    /**
     * Select answer for numeric.
     * @param {number|string} value - Question value.
     */
    setValue(value) {
        this._setValueInternal('value', () => this._setValue(value), this._diffPrimitives);
    }

    /**
     * Clear question values.
     */
    clearValues() {
        this._clearValuesInternal('value', () => this._clearValues(), this._diffPrimitives);
    }

    _setValue(value) {
        value = Utils.isEmpty(value) ? null : value.toString();

        if (this._value === value) {
            return false;
        }

        this._value = value;
        return true;
    }

    _clearValues() {
        if (!this._value) {
            return false;
        }

        this._value = null;
        return true;
    }

    _validateRule(validationType) {
        switch (validationType) {
            case ValidationTypes.Required:
                return this._validateRequired();
            case ValidationTypes.Numeric:
                return this._validateNumeric();
            case ValidationTypes.Precision:
                return this._validatePrecision();
            case ValidationTypes.Scale:
                return this._validateScale();
            case ValidationTypes.Range:
                return this._validateRange();
        }
    }

    _validateRequired() {
        if (!this.required) return new RuleValidationResult(true);

        let isValid = !Utils.isEmpty(this.value);
        return new RuleValidationResult(isValid);
    }

    _validateNumeric() {
        if (Utils.isEmpty(this.value)) return new RuleValidationResult(true);

        let isValid = !Utils.isNotANumber(this.value);
        return new RuleValidationResult(isValid);
    }

    _validatePrecision() {
        let { precision } = this.numeric;
        if (Utils.isEmpty(this.value) || Utils.isEmpty(precision) || Utils.isNotANumber(this.value))
            return new RuleValidationResult(true);

        let { totalDigits } = Utils.measureNumber(this.value);
        let isValid = totalDigits <= precision;
        return new RuleValidationResult(isValid);
    }

    _validateScale() {
        let { scale } = this.numeric;
        if (Utils.isEmpty(this.value) || Utils.isEmpty(scale) || Utils.isNotANumber(this.value))
            return new RuleValidationResult(true);

        let { decimalDigits } = Utils.measureNumber(this.value);
        let isValid = decimalDigits <= scale;
        return new RuleValidationResult(isValid);
    }

    _validateRange() {
        let { min, max } = this.numeric;

        if (Utils.isEmpty(this.value) || Utils.isNotANumber(this.value)) return new RuleValidationResult(true);

        if (!Utils.isEmpty(min) && this.value < min) return new RuleValidationResult(false);

        if (!Utils.isEmpty(max) && this.value > max) return new RuleValidationResult(false);

        return new RuleValidationResult(true);
    }
}
