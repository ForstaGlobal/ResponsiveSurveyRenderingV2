import QuestionWithAnswerView from "../base/question-with-answers-view";
import KEYS from "../../helpers/keyboard-keys";
import ValidationTypes from "../../../api/models/validation/validation-types";

export default class GridQuestionViewBase extends QuestionWithAnswerView {
    /**
     * @param {GridQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings = null) {
        super(question, settings);

        this._currentAnswerIndex = null;
        this._currentScaleIndex = null;

        this._attachToDOM();
    }

    get _answers() {
        return this._question.answers;
    }

    get _scales() {
        return this._question.scales;
    }

    get _currentAnswer() {
        return this._question.answers[this._currentAnswerIndex] || null;
    }

    get _currentScale() {
        return this._scales[this._currentScaleIndex] || null;
    }

    /**
     * @abstract
     * @param questionId
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _createIdProvider(questionId) {
        throw 'Not implemented';
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

    _getScaleGroupNode(answerCode) {
        return this._getAnswerNode(answerCode);
    }

    _attachToDOM() {
        this._answers.forEach((answer, answerIndex) => {
            this._scales.forEach((scale, scaleIndex) => {
                this._getScaleNode(answer.code, scale.code)
                    .on('click', event => this._onScaleNodeClick(event, answer, scale));
                this._getScaleControlNode(answer.code, scale.code)
                    .on('focus', this._onScaleControlNodeFocus.bind(this, answerIndex, scaleIndex));
            });

            if (answer.isOther) {
                this._getAnswerOtherNode(answer.code)
                    .on('input', event => this._onAnswerOtherNodeValueChange(answer, event.target.value));
            }
        });

        if (!this._settings.disableKeyboardSupport) {
            this._answers.forEach(answer => {
                this._getScaleGroupNode(answer.code)
                    .on('keydown', this._onGroupNodeKeyDown.bind(this));

                if (answer.isOther) {
                    this._getAnswerOtherNode(answer.code).on('keydown', event =>
                        this._onAnswerOtherNodeKeyDown(event, answer));
                }

                this._scales.forEach(scale => {
                    this._getScaleControlNode(answer.code, scale.code)
                        .on('keydown', this._onScaleControlNodeKeyDown.bind(this));
                });
            });
        }
    }

    _updateAnswerScaleNodes({values = []}) {
        if (values.length === 0)
            return;

        values.forEach(answerCode => {
            this._scales.forEach(scale => {
                this._clearScaleNode(answerCode, scale.code);
            });

            const scaleCode = this._question.values[answerCode];
            if (scaleCode === undefined) {
                this._getScaleControlNode(answerCode, this._scales[0].code).attr('tabindex', '0');
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
            .attr('tabindex', '-1')
            .css('background-color', '')
            .css('border-color', '');
    }


    _selectScaleNode(answerCode, scaleCode) {
        const scale = this._question.getScale(scaleCode);

        this._getScaleNode(answerCode, scaleCode).addClass(this._getSelectedScaleClass(scale));

        const controlNode = this._getScaleControlNode(answerCode, scaleCode);
        controlNode
            .addClass(this._getSelectedControlClass(scale))
            .attr('aria-checked', 'true')
            .attr('tabindex', '0');
        if (scale.backgroundColor !== null) {
            controlNode.css({backgroundColor: scale.backgroundColor, borderColor: scale.backgroundColor});
        }
    }

    _selectScale(answer, scale) {
        this._question.setValue(answer.code, scale.code);
    }

    _showErrors(validationResult) {
        this._showAnswerErrors(validationResult);
    }

    _showAnswerError(validationResult) {
        const answer = this._question.getAnswer(validationResult.answerCode);
        const targetNode = answer.isOther
            ? this._getAnswerOtherNode(answer.code)
            : this._getAnswerTextNode(answer.code);
        const errorBlockId = this._getAnswerErrorBlockId(answer.code);
        const errors = validationResult.errors.map(error => error.message);
        this._answerErrorBlockManager.showErrors(errorBlockId, targetNode, errors);

        const otherErrors = validationResult.errors.filter(error => error.type === ValidationTypes.OtherRequired);
        if (otherErrors.length > 0) {
            this._getAnswerOtherNode(validationResult.answerCode)
                .attr('aria-errormessage', errorBlockId)
                .attr('aria-invalid', 'true');
        }

        const answerHasNotOnlyOtherErrors = validationResult.errors.length > otherErrors.length;
        if (answerHasNotOnlyOtherErrors) {
            this._getScaleGroupNode(answer.code)
                .attr("aria-invalid", "true")
                .attr("aria-errormessage", errorBlockId);
        }
    }

    _hideErrors() {
        this._answerErrorBlockManager.removeAllErrors();

        this._answers.forEach(answer => {
            this._getScaleGroupNode(answer.code)
                .removeAttr("aria-invalid")
                .removeAttr("aria-errormessage");
        });

        this._container.find('.cf-text-box')
            .removeAttr('aria-errormessage')
            .removeAttr('aria-invalid');
    }

    _onModelValueChange({changes}) {
        this._updateAnswerScaleNodes(changes);
        this._updateAnswerOtherNodes(changes);
    }

    _onScaleNodeClick(event, answer, scale) {
        this._getScaleControlNode(answer.code).focus();
        this._selectScale(answer, scale);
    }

    // eslint-disable-next-line no-unused-vars
    _onAnswerOtherNodeKeyDown(event, answer) {
        if (event.keyCode === KEYS.Tab) {
            return;
        }
        event.stopPropagation();
    }

    _onScaleControlNodeFocus(answerIndex, scaleIndex) {
        this._currentAnswerIndex = answerIndex;
        this._currentScaleIndex = scaleIndex;
    }

    _onAnswerOtherNodeValueChange(answer, value) {
        this._question.setOtherValue(answer.code, value);
    }

    _onGroupNodeKeyDown(event) {
        if ([KEYS.ArrowUp, KEYS.ArrowLeft, KEYS.ArrowRight, KEYS.ArrowDown].includes(event.keyCode) === false) {
            return;
        }
        if (this._currentAnswerIndex === null || this._currentScaleIndex === null) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        let nextScale = null;
        switch (event.keyCode) {
            case KEYS.ArrowUp:
            case KEYS.ArrowLeft:
                if (this._currentScaleIndex > 0) {
                    nextScale = this._scales[this._currentScaleIndex - 1];
                } else {
                    nextScale = this._scales[this._scales.length - 1];
                }

                break;
            case KEYS.ArrowRight:
            case KEYS.ArrowDown:
                if (this._currentScaleIndex < this._scales.length - 1) {
                    nextScale = this._scales[this._currentScaleIndex + 1];
                } else {
                    nextScale = this._scales[0];
                }
                break;
        }

        this._selectScale(this._currentAnswer, nextScale);
        this._getScaleControlNode(this._currentAnswer.code, nextScale.code).focus();
    }

    _onScaleControlNodeKeyDown(event) {
        if ([KEYS.SpaceBar, KEYS.Enter].includes(event.keyCode) === false) {
            return;
        }
        if (this._currentAnswerIndex === null || this._currentScaleIndex === null) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        this._selectScale(this._currentAnswer, this._currentScale);
    }
}