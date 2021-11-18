import HorizontalRatingSingleQuestionView from "./horizontal-rating-single-question-view";

export default class StarRatingSingleQuestionView extends HorizontalRatingSingleQuestionView {
    constructor(question, settings) {
        super(question, settings);

        this._groupNode = this._container.find('.cf-sr-single');
    }

    _getSelectedControlClass(answerCode) {
        return this._isItemInScale(answerCode) ? "cf-star-rating-item--selected" : "cf-radio--selected";
    }

    _selectAnswerControlNode(answerCode) {
        this._selectAnswerControlVisually(this._question.getAnswer(answerCode));
        this._getAnswerControlNode(answerCode)
            .attr('aria-checked', 'true')
            .attr('tabindex', '0');

        if(this._isItemInScale(answerCode)) {
            const answerIndex = this._question.scaleItems.findIndex(item => item.code === answerCode);
            if (answerIndex !== -1) {
                this._question.scaleItems.forEach((answer, index) => {
                    if (index < answerIndex) {
                        this._selectAnswerControlVisually(answer);
                    }
                });
            }
        }
    }

    _selectAnswerControlVisually(answer) {
        const controlNode = this._getAnswerControlNode(answer.code);
        controlNode.addClass(this._getSelectedControlClass(answer.code));
        if (answer.backgroundColor !== null) {
            controlNode.css({backgroundColor: answer.backgroundColor,  borderColor: answer.backgroundColor, color: answer.backgroundColor});
        }
    }

    _clearAnswerControlNode(answerCode) {
        super._clearAnswerControlNode(answerCode);

        this._getAnswerControlNode(answerCode)
            .css('color', '');
    }
}