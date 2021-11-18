import $ from 'jquery';

export default class HiddenQuestionView {
    constructor(question) {
        this._question = question;
        this._container = $(`<div class="cf-page__question-hidden-fields" id="${this._question.id}_hidden">`).appendTo(
            '#page_form'
        );
    }

    get questionId() {
        return this._question.id;
    }

    render() {
        this._container.empty();
        const formValues = Object.entries(this._question.formValues);
        const inputs = formValues.map(([name, value]) => {
            return $('<input/>', {
                type: 'hidden',
                class: 'confirmit-hidden-input',
                name: name,
                value: value,
            });
        });
        this._container.prepend(inputs);
    }
}
