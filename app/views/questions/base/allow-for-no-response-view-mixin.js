import Utils from '../../../utils';
import $ from 'jquery';
import KEYS from '../../helpers/keyboard-keys';

const AllowForNoResponseViewMixin = questionView =>
    class extends questionView {
        /**
         * @param {AllowForNoResponseMixin|QuestionWithAnswers|Question} question
         * @param {QuestionViewSettings} settings
         * @param {function} cleanRegularValuesFn
         */
        constructor(question, settings, cleanRegularValuesFn) {
            super(question, settings);

            this._currentAnswerIndex = null;

            this._cleanRegularValuesFn = cleanRegularValuesFn || this._defaultCleanValues;
        }

        get _currentAnswer() {
            return this._question.noResponseAnswers[this._currentAnswerIndex];
        }

        /**
         * @override
         */
        _attachControlHandlers() {
            super._attachControlHandlers();

            this._question.noResponseAnswers.forEach((answer, index) => {
                this._getAnswerNode(answer.code).on('click', () => this._onNoResponseAnswerNodeClick(answer));
                this._getAnswerControlNode(answer.code)
                    .on('focus', this._onAnswerNodeFocus.bind(this, index))
                    .on('blur', this._onAnswerNodeBlur.bind(this));
            });

            if (!this._settings.disableKeyboardSupport) {
                this._container.on('keydown', this._onKeyPress.bind(this));
            }
        }

        /**
         * @override
         * TODO: isNormalValueChanged can be injected through constructor
         */
        _onModelValueChange(eventData) {
            super._onModelValueChange(eventData);

            const { value, values, otherValues, noResponseValue } = eventData.changes;

            if (noResponseValue !== undefined && !Utils.isEmpty(this._question.noResponseValue)) {
                this._cleanRegularValuesFn();
            }

            const isNormalValueChanged =
                (value !== undefined && !Utils.isEmpty(this._question.value)) ||
                (values !== undefined && !Utils.isEmpty(this._question.values[values])) ||
                (otherValues !== undefined && !Utils.isEmpty(this._question.otherValues[otherValues]));
            if (isNormalValueChanged && !Utils.isEmpty(this._question.noResponseValue)) {
                this._question.setNoResponseValue(null);
            }

            this._updateNoResponseAnswerNodes(eventData.changes);
        }

        /**
         * @override
         */
        _getAnswerNode(answerCode) {
            if (super._getAnswerNode !== undefined) {
                return super._getAnswerNode(answerCode);
            }
            return $('#' + this._idProvider.getAnswerNodeId(answerCode));
        }

        /**
         * @override
         */
        _getAnswerControlNode(answerCode) {
            if (super._getAnswerControlNode !== undefined) {
                return super._getAnswerControlNode(answerCode);
            }
            return $('#' + this._idProvider.getAnswerControlNodeId(answerCode));
        }

        _updateNoResponseAnswerNodes({ noResponseValue }) {
            if (noResponseValue === undefined) {
                return;
            }

            this._question.noResponseAnswers.forEach(answer => {
                this._clearAnswerNode(answer);
            });

            this._selectAnswerNode(this._question.noResponseValue);
        }

        _toggleNoResponseAnswer(answer) {
            if (this._question.noResponseValue === answer.code) {
                this._question.setNoResponseValue(null);
                return;
            }

            this._question.setNoResponseValue(answer.code);
        }

        _selectAnswerNode(answerCode) {
            this._getAnswerNode(answerCode).addClass('cf-checkbox-answer--selected');
            this._getAnswerControlNode(answerCode).addClass('cf-checkbox--selected').attr('aria-checked', true);
        }

        _clearAnswerNode(answer) {
            this._getAnswerNode(answer.code).removeClass('cf-checkbox-answer--selected');
            this._getAnswerControlNode(answer.code).removeClass('cf-checkbox--selected').attr('aria-checked', false);
        }

        /**
         * TODO: can be injected through constructor
         */
        _defaultCleanValues() {
            if (this._question.value !== undefined) {
                this._question.setValue(null);
                return;
            }
            if (this._question.values !== undefined) {
                if (Array.isArray(this._question.values)) {
                    this._question.values.forEach(answerCode => {
                        this._question.setValue(answerCode, false);
                    });
                } else {
                    Object.keys(this._question.values).forEach(answerCode => {
                        this._question.setValue(answerCode, null);
                    });
                }
            }
        }

        _onNoResponseAnswerNodeClick(answer) {
            this._getAnswerControlNode(answer.code).focus();
            this._toggleNoResponseAnswer(answer);
        }

        _onAnswerNodeFocus(answerIndex) {
            this._currentAnswerIndex = answerIndex;
        }

        _onAnswerNodeBlur() {
            this._currentAnswerIndex = null;
        }

        _onKeyPress(event) {
            this._onSelectKeyPress(event);
        }

        _onSelectKeyPress(event) {
            if ([KEYS.SpaceBar, KEYS.Enter].includes(event.keyCode) === false) {
                return;
            }
            if (Utils.isEmpty(this._currentAnswer)) {
                return;
            }

            event.preventDefault();

            this._toggleNoResponseAnswer(this._currentAnswer);
        }
    };
export default AllowForNoResponseViewMixin;
