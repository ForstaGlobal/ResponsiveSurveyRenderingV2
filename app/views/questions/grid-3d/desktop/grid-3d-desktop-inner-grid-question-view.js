import Grid3DDesktopInnerQuestionView from "./grid-3d-desktop-inner-question-view";

export default class Grid3DDesktopInnerGridQuestionView extends Grid3DDesktopInnerQuestionView {
    constructor(parentQuestion, question, settings = null) {
        super(parentQuestion, question, settings);

        this._attachHandlersToDOM();
    }

    _getSelectedScaleClass(scale){
        if(this._question.answerButtons) {
            return 'cf-button-answer--selected';
        }
        if(scale.imagesSettings !== null) {
            return 'cf-image-answer--selected';
        }

        return 'cf-radio-answer--selected';
    }

    _getSelectedControlClass(scale) {
        if(this._question.answerButtons) {
            return 'cf-button--selected';
        }
        if(scale.imagesSettings !== null) {
            return 'cf-image--selected';
        }

        return 'cf-radio--selected';
    }

    _attachHandlersToDOM() {
        this._question.answers.forEach((answer) => {
            this._question.scales.forEach((scale) => {
                this._getScaleNode(answer.code, scale.code)
                    .on('click', () => this._onScaleNodeClick(answer, scale));
            });
        });
    }

    _updateAnswerScaleNodes({values = []}) {
        if (values.length === 0)
            return;

        values.forEach(answerCode => {
            this._question.scales.forEach(scale => {
                this._clearScaleNode(answerCode, scale.code);
            });

            const scaleCode = this._question.values[answerCode];
            if (scaleCode === undefined) {
                //this._getScaleControlNode(answerCode, this._scales[0].code).attr('tabindex', '0');
            } else {
                this._selectScaleNode(answerCode, scaleCode);
            }
        });
    }

    _clearScaleNode(answerCode, scaleCode) {
        const scale = this._question.getScale(scaleCode);
        this._getScaleNode(answerCode, scaleCode).removeClass(this._getSelectedScaleClass(scale));
        this._getScaleControlNode(answerCode, scaleCode)
            .removeClass(this._getSelectedControlClass(scale))
            .attr('aria-checked', 'false')
            //.attr('tabindex', '-1')
            .css('background-color', '')
            .css('border-color', '');
    }


    _selectScaleNode(answerCode, scaleCode) {
        const scale = this._question.getScale(scaleCode);

        this._getScaleNode(answerCode, scaleCode).addClass(this._getSelectedScaleClass(scale));

        const controlNode = this._getScaleControlNode(answerCode, scaleCode);
        controlNode
            .addClass(this._getSelectedControlClass(scale))
            .attr('aria-checked', 'true');
            //.attr('tabindex', '0');
        if (scale.backgroundColor !== null) {
            controlNode.css({backgroundColor: scale.backgroundColor, borderColor: scale.backgroundColor});
        }
    }

    _onModelValueChange({changes}) {
        this._updateAnswerScaleNodes(changes);
    }

    _onScaleNodeClick(answer, scale) {
        this._question.setValue(answer.code, scale.code);
    }
}