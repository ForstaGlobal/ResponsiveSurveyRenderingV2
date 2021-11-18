import Grid3DDesktopInnerQuestionView from "./grid-3d-desktop-inner-question-view";
import MultiCountHelper from '../../../helpers/multi-count-helper';

export default class Grid3DDesktopInnerMultiQuestionView extends Grid3DDesktopInnerQuestionView {
    constructor(parentQuestion, question, settings = null) {
        super(parentQuestion, question, settings);

        this._attachHandlersToDOM();
    }

    _attachHandlersToDOM() {
        this._question.answers.forEach(answer => {
            this._getAnswerNode(answer.code).on('click', this._onAnswerNodeClick.bind(this, answer));
        });
    }

    _getSelectedControlClass(answer){
        if(answer.imagesSettings !== null){
            return 'cf-image--selected';
        }

        if(answer.isExclusive){
            return 'cf-radio--selected';
        }

        return'cf-checkbox--selected';
    }

    _getSelectedAnswerClass(answer) {
        if(answer.imagesSettings !== null){
            return 'cf-image-answer--selected';
        }

        if(answer.isExclusive){
            return 'cf-radio-answer--selected';
        }

        return 'cf-checkbox-answer--selected';
    }

    _getDisabledAnswerClass(answer) {
        if (answer.imagesSettings !== null) {
            return 'cf-image-answer--disabled';
        }

        return 'cf-checkbox-answer--disabled';
    }

    _isSelected(answer) {
        return this._question.values.includes(answer.code);
    }

    _updateAnswerNodes({values = []}) {
        if (values.length === 0)
            return;

        this._question.answers.forEach((answer) => {
            this._clearAnswerNode((answer));

            if (MultiCountHelper.isMultiCountSet(this._question.multiCount)) {
                const isMaxMultiCountReached = MultiCountHelper.isMaxMultiCountReached(
                    this._question.values.length,
                    this._question.multiCount
                );

                if (isMaxMultiCountReached && !answer.isExclusive && !this._question.values.includes(answer.code)) {
                    this._getAnswerNode(answer.code).addClass(this._getDisabledAnswerClass(answer));
                }
            }
        });

        this._question.values.forEach(answerCode =>
            this._selectAnswerNode( this._question.getAnswer(answerCode)));
    }

    _selectAnswerNode(answer){
        this._getAnswerNode(answer.code).addClass(this._getSelectedAnswerClass(answer));
        const controlNode = this._getAnswerControlNode(answer.code);
        controlNode
            .addClass(this._getSelectedControlClass(answer))
            .attr('aria-checked', true);

        if (answer.backgroundColor !== null) {
            controlNode.css({backgroundColor: answer.backgroundColor, borderColor: answer.backgroundColor});
        }
    }

    _clearAnswerNode(answer){
        this._getAnswerNode(answer.code)
            .removeClass(this._getSelectedAnswerClass(answer))
            .removeClass(this._getDisabledAnswerClass(answer));

        this._getAnswerControlNode(answer.code)
            .removeClass(this._getSelectedControlClass(answer))
            .attr('aria-checked', false)
            .css({backgroundColor: "", borderColor: ""})
    }

    _onAnswerNodeClick(answer) {
        const newValue = !this._isSelected(answer);

        if (newValue) {
            const isMaxMultiCountReached = MultiCountHelper.isMaxMultiCountReached(
                this._question.values.length,
                this._question.multiCount
            );
            if (isMaxMultiCountReached && !answer.isExclusive) {
                return;
            }
        }

        this._question.setValue(answer.code, newValue);
    }

    _onModelValueChange({changes}) {
        this._updateAnswerNodes(changes);
    }
}