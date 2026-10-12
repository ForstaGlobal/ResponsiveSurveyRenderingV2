import QuestionView from './base/question-view.js';

export default class LoginPageQuestionView extends QuestionView {
    constructor(question) {
        super(question);

        this._userNameInputNode = this._container.find('.cf-login__field--user-name > input');
        this._passwordInputNode = this._container.find('.cf-login__field--password > input');

        this._attachControlHandlers();
    }

    _onModelValueChange() {
        if (this._question.value === null) {
            return;
        }

        this._userNameInputNode.val(this._question.value.userName);
        this._passwordInputNode.val(this._question.value.password);
    }

    /* Control handlers */
    _attachControlHandlers() {
        this._userNameInputNode.on('input', this._onInputChangeHandler.bind(this));
        this._passwordInputNode.on('input', this._onInputChangeHandler.bind(this));
    }

    _onInputChangeHandler() {
        this._question.setValue(this._userNameInputNode.val(), this._passwordInputNode.val());
    }

    _showErrors(validationResult) {
        super._showErrors(validationResult);

        const { isUserNameValid, isPasswordValid } = validationResult.errors[0].data;
        if (!isUserNameValid) {
            this._userNameInputNode.attr('aria-invalid', true);
        }
        if (!isPasswordValid) {
            this._passwordInputNode.attr('aria-invalid', true);
        }
    }

    _hideErrors() {
        super._hideErrors();
        this._userNameInputNode.attr('aria-invalid', false);
        this._passwordInputNode.attr('aria-invalid', false);
    }
}
