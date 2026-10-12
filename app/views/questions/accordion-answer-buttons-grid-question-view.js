import AccordionGridQuestionView from './accordion-grid-question-view';

export default class AccordionAnswerButtonsGridQuestionView extends AccordionGridQuestionView {
    constructor(question, settings) {
        super(question, settings);

        this._selectedControlCssClass = 'cf-button--selected';
        this._selectedAnswerCssClass = 'cf-button-answer--selected';
    }
}
