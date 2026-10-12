import QuestionWithAnswers from '../base/question-with-answers';
import Utils from '../../../utils';
import ValidationTypes from '../validation/validation-types';
import RuleValidationResult from '../validation/rule-validation-result';
import Scale from '../base/scale';

/**
 * @extends {QuestionWithAnswers}
 */
export default class MaxDiffQuestion extends QuestionWithAnswers {
    constructor(model) {
        super(model);

        this._answerButtons = model.answerButtons || false;
        this._values = { ...model.values };
        this._selectedStatusLabel = model.selectedStatusLabel || '';

        this._parseScales(model);
    }

    /**
     * Is it answer buttons.
     * @type {boolean}
     * @readonly
     */
    get answerButtons() {
        return this._answerButtons;
    }

    /**
     * `{<answerCode>: <value>}`
     * @type {Object}
     * @readonly
     */
    get values() {
        return { ...this._values };
    }

    /**
     * The array of scales.
     * @type {Scale[]}
     * @readonly
     */
    get scales() {
        return this._scales;
    }

    /**
     * Status text of selected scales.
     * @type {string}
     * @readonly
     */
    get selectedStatusLabel() {
        return this._selectedStatusLabel;
    }

    /**
     * @inheritDoc
     */
    get formValues() {
        let form = {};

        const acceptableValues = {
            best: 1,
            worst: -1,
        };

        this.answers.forEach(answer => {
            const value = this.values[answer.code];
            form[answer.fieldName] = !Utils.isEmpty(value) ? acceptableValues[this.values[answer.code]] : 0;
        });

        return form;
    }

    /**
     * Select answer for ranking.
     * @param {string} answerCode - Answer code.
     * @param {string} scaleCode - Scale code.
     */
    setValue(answerCode, scaleCode) {
        this._setValueInternal('values', () => this._setValue(answerCode, scaleCode));
    }

    /**
     * Get scale by code.
     * @param {string} code - Scale code.
     * @return {Scale}
     */
    getScale(code) {
        if (code === null) {
            return null;
        }
        code = code.toString();
        return this._scales.find(scale => scale.code === code);
    }

    /**
     * Clear question values.
     */
    clearValues() {
        this._clearValuesInternal('values', () => this._clearValues());
    }

    _parseScales({ scales }) {
        if (!scales || scales.length === 0) {
            return;
        }

        this._scales = scales.map(scaleModel => new Scale(scaleModel));
    }

    _clearValues() {
        if (Object.keys(this._values).length === 0) {
            return false;
        }

        this._values = {};
        return true;
    }

    _setValue(answerCode, scaleCode) {
        if (this._isCatiReviewingMode) {
            return false;
        }

        answerCode = answerCode.toString();

        if (!this.getAnswer(answerCode) || !this.getScale(scaleCode)) {
            return false;
        }

        const currentValue = Object.entries(this._values)
            .filter(([, value]) => value === scaleCode)
            .map(([code]) => code)[0];
        delete this._values[currentValue];

        this._values[answerCode] = scaleCode;

        return true;
    }

    _validateRule(validationType) {
        switch (validationType) {
            case ValidationTypes.Required:
                return this._validateRequired();
            case ValidationTypes.MaxDiff:
                return this._validateMaxDiff();
        }
    }

    _validateRequired() {
        if (!this.required) return new RuleValidationResult(true);
        let isValid = Object.values(this.values).length !== 0;
        return new RuleValidationResult(isValid);
    }

    _validateMaxDiff() {
        const values = Object.values(this.values);

        // bypass if not answered (covered by required validation)
        if (values.length === 0) return new RuleValidationResult(true);

        let isValid = this._scales.every(scale => values.includes(scale.code));
        return new RuleValidationResult(isValid);
    }
}
