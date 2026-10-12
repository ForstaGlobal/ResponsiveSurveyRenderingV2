import QuestionView from './base/question-view';
import $ from 'jquery';
import KEYS from '../helpers/keyboard-keys';

export default class MaxDiffQuestionView extends QuestionView {
    /**
     * @param {MaxDiffQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);

        this._currentAnswerIndex = null;
        this._currentScaleIndex = null;
        this._statusNode = this._container.find('.cf-max-diff-status');

        this._attachHandlersToDOM();
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

    _getSelectedAnswerClass() {
        return 'cf-radio-answer--selected';
    }

    _getSelectedControlClass() {
        return 'cf-radio--selected';
    }

    _getScaleNode(answerCode, scaleCode) {
        return $('#' + this._idProvider.getScaleNodeId(answerCode, scaleCode));
    }

    _getScaleControlNode(answerCode, scaleCode) {
        return $('#' + this._idProvider.getScaleControlNodeId(answerCode, scaleCode));
    }

    _attachHandlersToDOM() {
        this._answers.forEach((answer, answerIndex) => {
            this._scales.forEach((scale, scaleIndex) => {
                this._getScaleNode(answer.code, scale.code).on(
                    'click',
                    this._onScaleNodeClick.bind(this, answer, scale)
                );
                this._getScaleControlNode(answer.code, scale.code).on(
                    'focus',
                    this._onScaleControlNodeFocus.bind(this, answerIndex, scaleIndex)
                );
            });
        });

        if (!this._settings.disableKeyboardSupport) {
            this._answers.forEach(answer => {
                this._scales.forEach(scale => {
                    this._getScaleControlNode(answer.code, scale.code).on('keydown', this._onKeyPress.bind(this));
                });
            });
        }
    }

    _selectScale(answer, scale) {
        this._question.setValue(answer.code, scale.code);
    }

    _selectScaleNode(answer, scaleCode) {
        this._getScaleNode(answer.code, scaleCode).addClass(this._getSelectedAnswerClass());
        const controlNode = this._getScaleControlNode(answer.code, scaleCode);

        controlNode.addClass(this._getSelectedControlClass()).attr('tabindex', '0').attr('aria-checked', 'true');

        if (answer.backgroundColor !== null) {
            controlNode.css({ backgroundColor: answer.backgroundColor, borderColor: answer.backgroundColor });
        }
    }

    _clearScaleNode(answer, scale) {
        this._getScaleNode(answer.code, scale.code).removeClass(this._getSelectedAnswerClass());
        this._getScaleControlNode(answer.code, scale.code)
            .removeClass(this._getSelectedControlClass())
            .attr('aria-checked', 'false')
            .attr('tabindex', '-1')
            .css('background-color', '')
            .css('border-color', '');
    }

    _updateScaleNodes({ values }) {
        if (values.length === 0) {
            return;
        }

        values.forEach(answerCode => {
            const answer = this._question.getAnswer(answerCode);
            this._scales.forEach(scale => {
                this._clearScaleNode(answer, scale);
            });

            const scaleCode = this._question.values[answerCode];

            if (scaleCode === undefined) {
                this._getScaleControlNode(answerCode, this._scales[0].code).attr('tabindex', '0');
            } else {
                this._selectScaleNode(answer, scaleCode);
            }
        });
    }

    _updateStatusNode() {
        const scaleCodes = this._question.scales.map(scale => scale.code);

        const statusText = Object.entries(this._question.values)
            //keeping status text order as scales orders
            .sort(([, a], [, b]) => scaleCodes.indexOf(a) - scaleCodes.indexOf(b))
            .map(
                ([answerCode, scaleCode]) =>
                    `${this._question.getScale(scaleCode).text} ${this._question.getAnswer(answerCode).text}`
            )
            .join(', ');

        this._statusNode.html(`${this._question.selectedStatusLabel} ${statusText}`);
    }

    _onModelValueChange({ changes }) {
        this._updateScaleNodes(changes);
        this._updateStatusNode();
    }

    _onScaleNodeClick(answer, scale) {
        this._getScaleControlNode(answer.code, scale.code).focus();
        this._selectScale(answer, scale);
    }

    _onScaleControlNodeFocus(answerIndex, scaleIndex) {
        this._currentAnswerIndex = answerIndex;
        this._currentScaleIndex = scaleIndex;
    }

    _onKeyPress(event) {
        this._onArrowKeyPress(event);
        this._onSelectKeyPress(event);
    }

    _onArrowKeyPress(event) {
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

        this._getScaleControlNode(this._currentAnswer.code, nextScale.code).focus();
    }

    _onSelectKeyPress(event) {
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
