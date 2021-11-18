import QuestionWithAnswers from './../base/question-with-answers.js';
import Scale from './../base/scale.js';
import HeadGroup from './../base/head-group.js';
import ValidationTypes from '../validation/validation-types.js';
import RuleValidationResult from '../validation/rule-validation-result.js';
import Utils from 'utils.js';

/**
 * @extends {QuestionWithAnswers}
 */
export default class GridQuestionBase extends QuestionWithAnswers {
    /**
     * @param {object} model - The instance of the model.
     */
    constructor(model) {
        super(model);

        this._scales = [];
        this._scaleGroups = [];

        this._values = { ...model.values };
        this._otherValues = { ...model.otherValues };

        this._parseScaleGroups(model);
        this._parseScales(model);
    }

    /**
     * `{<answerCode>: <scaleCode>...}`
     * @type {Object}
     * @readonly
     */
    get values() {
        return { ...this._values };
    }

    /**
     * `{<answerCode>: <otherValue>...}`
     * @type {Object}
     * @readonly
     */
    get otherValues() {
        return { ...this._otherValues };
    }

    /**
     * @inheritDoc
     */
    get formValues() {
        let form = {};

        Object.entries(this.values).forEach(([answerCode, scaleCode]) => {
            let answer = this.getAnswer(answerCode);
            if (answer) {
                form[answer.fieldName] = scaleCode;
                if (answer.isOther) {
                    form[answer.otherFieldName] = this.otherValues[answerCode];
                }
            }
        });

        return form;
    }

    /**
     * Set value for grid.
     * @param {string} answerCode - Answer code.
     * @param {string} scaleCode - Scale code.
     */
    setValue(answerCode, scaleCode) {
        this._setValueInternal('values', () => this._setValue(answerCode, scaleCode));
    }

    /**
     * Set other answer value.
     * @param {string} answerCode - Answer code.
     * @param {string} otherValue - Other value.
     */
    setOtherValue(answerCode, otherValue) {
        this._setValueInternal('otherValues', () => this._setOtherValue(answerCode, otherValue));
    }

    /**
     * Clear question values.
     */
    clearValues() {
        this._clearValuesInternal('values', () => this._clearValues());
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
     * The array of answer groups.
     * @type {HeadGroup[]}
     * @readonly
     */
    get scaleGroups() {
        return this._scaleGroups;
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
        return this._scales.find((scale) => scale.code === code);
    }

    /**
     * Get scales array by codes array.
     * @param {string[]} codes - Array of scale codes.
     * @return {Scale[]} - Scales array.
     */
    getScales(codes) {
        codes = codes.map((item) => item.toString());
        return this._scales.filter((answer) => codes.includes(answer.code));
    }

    /**
     * Get scale group by code.
     * @param {string} code - Group code.
     * @return {HeadGroup}
     */
    getScaleGroup(code) {
        if (code === null) {
            return null;
        }
        code = code.toString();
        return this._scaleGroups.find((group) => group.code === code);
    }

    _parseScaleGroups({ scaleGroups }) {
        if (!scaleGroups || scaleGroups.length === 0) {
            return;
        }
        // create empty groups to populate them in _parseScales method
        this._scaleGroups = scaleGroups.map((group) => new HeadGroup(group));
    }

    _parseScales({ scales }) {
        if (!scales || scales.length === 0) {
            return;
        }

        scales.forEach((scaleModel) => {
            let scale;
            if (scaleModel.groupCode) {
                let group = this.getScaleGroup(scaleModel.groupCode);
                scale = new Scale(scaleModel, group);
                group.items.push(scale);
            } else {
                scale = new Scale(scaleModel);
            }
            this._scales.push(scale);
        });
    }

    _setValue(answerCode, scaleCode) {
        answerCode = answerCode.toString();

        const answer = this.getAnswer(answerCode);
        if (!answer) {
            return false;
        }

        if (Utils.isEmpty(scaleCode)) {
            if (this._values[answerCode] === undefined) return false;
            delete this._values[answerCode];
        } else {
            scaleCode = scaleCode.toString();
            const scale = this.getScale(scaleCode);
            if (!scale) {
                return false;
            }
            if (this._values[answerCode] === scaleCode) {
                return false;
            }
            this._values[answerCode] = scaleCode;
        }

        return true;
    }

    _clearValues() {
        if (this._values === {}) {
            return false;
        }

        this._values = {};
        return true;
    }

    _validateRule(validationType) {
        switch (validationType) {
            case ValidationTypes.Required:
                return this._validateRequired();
            case ValidationTypes.OtherRequired:
                return this._validateOther();
            case ValidationTypes.RequiredIfOtherSpecified:
                return this._validateRequiredIfOtherSpecified();
        }
    }

    _validateRequired() {
        if (!this.required) return new RuleValidationResult(true);

        let invalidAnswers = [];

        this.answers.forEach((answer) => {
            let isNormalAnswer = !answer.isOther;
            let isEmpty = Utils.isEmpty(this.values[answer.code]);
            if (isNormalAnswer && isEmpty) invalidAnswers.push(answer.code);
        });

        let isValid = invalidAnswers.length === 0;
        return new RuleValidationResult(isValid, invalidAnswers);
    }

    _validateOther() {
        let invalidAnswers = [];

        this.answers.forEach((answer) => {
            let isOtherAnswer = answer.isOther;
            let isNotEmpty = !Utils.isEmpty(this.values[answer.code]);
            let otherIsEmpty = Utils.isEmpty(this.otherValues[answer.code]);
            if (isOtherAnswer && isNotEmpty && otherIsEmpty) invalidAnswers.push(answer.code);
        });

        let isValid = invalidAnswers.length === 0;
        return new RuleValidationResult(isValid, invalidAnswers);
    }
}
