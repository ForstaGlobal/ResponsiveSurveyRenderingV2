import AllowForNoResponseViewMixin from './base/allow-for-no-response-view-mixin.js';
import QuestionView from './base/question-view.js';

export class OpenTextQuestionView extends QuestionView {
    constructor(question, settings) {
        super(question, settings);
        this._input = this._getQuestionInputNode();
        this._attachControlHandlers();
    }

    _onModelValueChange() {
        const value = this._question.value || '';
        if (this._input.val() !== value) {
            this._input.val(value);
        }
    }

    _showErrors(validationResult) {
        super._showErrors(validationResult);
        this._input.attr('aria-invalid', true);
    }

    _hideErrors() {
        super._hideErrors();
        this._input.attr('aria-invalid', false);
    }

    /* Control handlers */
    _attachControlHandlers() {
        this._input.on('input', event => {
            this._question.setValue(event.target.value);
        });
    }
}

export default AllowForNoResponseViewMixin(OpenTextQuestionView);
