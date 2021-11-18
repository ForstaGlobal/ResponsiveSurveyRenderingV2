import Grid3DDesktopInnerQuestionView from "./grid-3d-desktop-inner-question-view";

export default class Grid3DDesktopInnerSingleQuestionView extends Grid3DDesktopInnerQuestionView {
    constructor(parentQuestion, question, settings = null) {
        super(parentQuestion, question, settings);

        this._attachHandlersToDOM();
    }

    _attachHandlersToDOM() {
        this._question.answers.forEach(answer => {
            this._getAnswerNode(answer.code).on('click', this._onAnswerNodeClick.bind(this, answer));
        });
    }

    _getSelectedAnswerClass(answer) {
        return answer.imagesSettings !== null ? 'cf-image-answer--selected' : 'cf-radio-answer--selected';
    }

    _getSelectedControlClass(answer) {
        return answer.imagesSettings !== null ? 'cf-image--selected' : 'cf-radio--selected';
    }

    _updateAnswerNodes({value}) {
        if (value === undefined) {
            return;
        }

        this._question.answers.forEach(answer => {
            this._clearAnswerNode(answer);
        });

        if (this._question.value === null) {
            // this._getAnswerControlNode(this._question.answers[0].code)
            //     .attr('tabindex', '0');
            return;
        }

        this._selectAnswerNode(this._question.getAnswer(this._question.value));
    }

    _selectAnswerNode(answer) {
        this._getAnswerNode(answer.code).addClass(this._getSelectedAnswerClass(answer));
        const controlNode = this._getAnswerControlNode(answer.code);

        controlNode
            .addClass(this._getSelectedControlClass(answer))
            .attr('aria-checked', 'true');
            //.attr('tabindex', '0');

        if (answer.backgroundColor !== null) {
            controlNode.css({backgroundColor: answer.backgroundColor, borderColor: answer.backgroundColor});
        }
    }

    _clearAnswerNode(answer) {
        this._getAnswerNode(answer.code).removeClass(this._getSelectedAnswerClass(answer));
        this._getAnswerControlNode(answer.code)
            .removeClass(this._getSelectedControlClass(answer))
            .attr('aria-checked', 'false')
            //.attr('tabindex', '-1')
            .css('background-color', '')
            .css('border-color', '');
    }

    _onAnswerNodeClick(answer) {
        this._question.setValue(answer.code);
    }

    _onModelValueChange({changes}) {
        this._updateAnswerNodes(changes);
    }
}