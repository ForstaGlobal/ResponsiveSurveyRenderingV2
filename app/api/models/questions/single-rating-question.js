import QuestionWithAnswers from 'api/models/base/question-with-answers.js';
import ValidationTypes from 'api/models/validation/validation-types.js';
import RuleValidationResult from '../validation/rule-validation-result.js';
import Utils from 'utils.js';

/**
 * @extends {QuestionWithAnswers}
 */
export default class SingleRatingQuestion extends QuestionWithAnswers {
    /**
     * Create instance.
     * @param {object} model - The instance of the model.
     */
    constructor(model) {
        super(model);

        this._scaleItems = [];
        this._nonScaleItems = [];

        this._value = model.value || null;

        this._loadScales(model);
    }

    /**
     * Answers in rating scale; If option "Exclude Non-scored" is enabled, it contains only answers with score.
     * @type {Answer[]}
     * @readonly
     */
    get scaleItems() {
        return this._scaleItems;
    }

    /**
     * Answers not in rating scale; If option "Exclude Non-scored" is enabled, it contains only answers without score, Otherwise it's empty collection.
     * @type {Answer[]}
     * @readonly
     */
    get nonScaleItems() {
        return this._nonScaleItems;
    }

    /**
     * Selected answer code.
     * @type {string}
     * @readonly
     */
    get value() {
        return this._value;
    }

    /**
     * Set value.
     * @param {string} value - Answer code.
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

    /**
     * @inheritDoc
     */
    get formValues() {
        const form = {};
        const answer = this.getAnswer(this.value);

        if (answer) {
            form[answer.fieldName] = this.value;
        }

        return form;
    }

    _setValue(value) {
        value = Utils.isEmpty(value) ? null : value.toString();
        if (this._value === value) {
            return false;
        }

        if (value !== null) {
            const answer = this.getAnswer(value);
            if (!answer) {
                return false;
            }
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

    _loadScales({ scaleItems = [], nonScaleItems = [] }) {
        this._scaleItems = this.getAnswers(scaleItems);
        this._nonScaleItems = this.getAnswers(nonScaleItems);
    }

    _validateRule(validationType) {
        switch (validationType) {
            case ValidationTypes.Required:
                return this._validateRequired();
        }
    }

    _validateRequired() {
        if (!this.required) return new RuleValidationResult(true);

        let isValid = !Utils.isEmpty(this.value);
        return new RuleValidationResult(isValid);
    }
}
