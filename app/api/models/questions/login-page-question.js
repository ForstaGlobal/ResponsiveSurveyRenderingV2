import Question from '../base/question';
import Utils from '../../../utils';
import ValidationTypes from '../validation/validation-types';
import RuleValidationResult from '../validation/rule-validation-result';

export default class LoginPageQuestion extends Question {
    /**
     * Create instance.
     * @param {object} model - The instance of the model.
     */
    constructor(model) {
        super(model);
        this._onlyUserId = model.onlyUserId || false;
        this._loginFieldName = model.loginFieldName;
        this._passwordFieldName = model.passwordFieldName;

        this._userName = null;
        this._password = null;
    }

    /**
     * Login page value.
     * @type {{userName: ?string, password: ?string}}
     * @readonly
     */
    get value() {
        return { userName: this._userName, password: this._password };
    }

    /**
     * @inheritDoc
     */
    get formValues() {
        const form = {
            [this._loginFieldName]: this._userName,
            [this._passwordFieldName]: this._password,
        };

        return form;
    }

    /**
     * Set data for login.
     * @param {string} userName - user name.
     * @param {string} password - password.
     */
    setValue(userName, password) {
        this._setValueInternal('value', () => this._setValue(userName, password), this._diffPrimitives);
    }

    /**
     * Clear question values.
     */
    clearValues() {
        this._clearValuesInternal('value', () => this._clearValues(), this._diffPrimitives);
    }

    _setValue(userName, password) {
        this._userName = Utils.isEmpty(userName) ? null : userName.toString();
        this._password = Utils.isEmpty(password) ? null : password.toString();
        return true;
    }

    _clearValues() {
        if (!this._userName && !this._password) {
            return false;
        }

        this._userName = null;
        this._password = null;

        return true;
    }

    _validateRule(validationType) {
        switch (validationType) {
            case ValidationTypes.Login:
                return this._validateLogin();
        }
    }

    _validateLogin() {
        if (!this.required) return new RuleValidationResult(true);

        const { userName, password } = this.value;
        const validationData = {
            isUserNameValid: !Utils.isEmpty(userName),
            isPasswordValid: this._onlyUserId ? true : !Utils.isEmpty(password),
        };
        const isValid = validationData.isUserNameValid && validationData.isPasswordValid;
        return new RuleValidationResult(isValid, [], validationData);
    }
}
