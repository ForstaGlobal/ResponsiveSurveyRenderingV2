import Answer from './answer';
import ValidationTypes from '../validation/validation-types';
import RuleValidationResult from '../validation/rule-validation-result';
import Utils from 'utils.js';

/**
 *  The mixin to add no-response functionality ("Don't know" and "Refuse to answer" answers).
 *  NB! This mixin works correctly with one assumption that all question which support "required" validation rule have handle it with "_validateRule" method.
 * @param {Question|QuestionWithAnswers} base
 */
const AllowForNoResponseMixin = base =>
    class extends base {
        /**
         * @param {object} model - raw question model.
         * @param {function(): boolean} isNormalValueEmptyFn - function to check is "regular" question model value is empty.
         */
        constructor(model, isNormalValueEmptyFn) {
            super(model);

            if (isNormalValueEmptyFn === undefined) {
                throw 'AllowForNoResponseMixin: "isNormalValueEmptyFn" parameter is not defined.';
            }

            this._isNormalValueEmpty = isNormalValueEmptyFn;
            this._noResponseAnswers = [];
            this._noResponseValue = model.noResponseValue || null;

            this._parseNoResponseAnswers(model);
        }

        /**
         * Array of available no-response answers.
         * @type {Answer[]}
         * @readonly
         */
        get noResponseAnswers() {
            return this._noResponseAnswers;
        }

        /**
         * No-response value. Answer code.
         * @type {string}
         * @readonly
         */
        get noResponseValue() {
            return this._noResponseValue;
        }

        /**
         * @inheritDoc
         */
        get formValues() {
            let form = super.formValues;

            const answer = this._noResponseAnswers.find(answer => answer.code === this.noResponseValue);
            if (answer !== undefined) {
                form[answer.fieldName] = 1;
            }

            return form;
        }

        /**
         * Set no-response value. Can be used one of available answers from noResponseAnswers collection.
         * @param {string | null | undefined} value - Answer code
         */
        setNoResponseValue(value) {
            this._setValueInternal('noResponseValue', () => this._setNoResponseValue(value), this._diffPrimitives);
        }

        /**
         * Get answer by code.
         * @override possible
         * @param {string} code - Answer code.
         * @return {Answer|undefined}
         */
        getAnswer(code) {
            if (code === null) {
                return undefined;
            }
            code = code.toString();

            if (super.getAnswer !== undefined) {
                const answer = super.getAnswer(code);
                if (answer !== undefined) {
                    return answer;
                }
            }

            return this.noResponseAnswers.find(answer => answer.code === code);
        }

        _setNoResponseValue(value) {
            value = Utils.isEmpty(value) ? null : value.toString();

            if (this._noResponseValue === value) {
                return false;
            }

            if (value !== null) {
                const answer = this.getAnswer(value);
                if (!answer) {
                    return false;
                }
            }

            this._noResponseValue = value;
            return true;
        }

        _parseNoResponseAnswers({ noResponseAnswers }) {
            if (!noResponseAnswers || noResponseAnswers.length === 0) {
                return;
            }

            noResponseAnswers.forEach(answerModel => {
                this._noResponseAnswers.push(new Answer(answerModel));
            });
        }

        _isAllowedForNoResponseAndHasNoResponseValue() {
            return this._noResponseAnswers.length > 0 && !Utils.isEmpty(this.noResponseValue);
        }

        /**
         * @override
         */
        _validateRule(validationType) {
            if (validationType === ValidationTypes.AllowForNoResponse) {
                return this._validateAllowForNoResponse();
            }

            return super._validateRule(validationType);
        }

        /**
         * TODO: assumption that all supported questions have "require" validation with name _validateRequired
         */
        _validateRequired() {
            if (this._isAllowedForNoResponseAndHasNoResponseValue()) {
                return new RuleValidationResult(true);
            }

            return super._validateRequired();
        }

        _validateAllowForNoResponse() {
            if (this._noResponseAnswers.length === 0 || Utils.isEmpty(this.noResponseValue)) {
                return new RuleValidationResult(true);
            }

            const isNormalValueEmpty = this._isNormalValueEmpty();
            const substitutions = Utils.isEmpty(this.noResponseValue)
                ? {}
                : {
                      SEL_EXCL_OR: `"${this.getAnswer(this.noResponseValue).text}"`,
                  };
            return new RuleValidationResult(isNormalValueEmpty, [], { substitutions });
        }
    };
export default AllowForNoResponseMixin;
