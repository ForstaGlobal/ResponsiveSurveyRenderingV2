import Utils from '../../../utils';

const StoredOtherValuesMixin = (questionView) =>
    class extends questionView {
        /**
         * @param {QuestionWithAnswers} question
         * @param {QuestionViewSettings} settings
         * @param {OtherValuesKeeper} otherValuesKeeper
         */
        constructor(question, settings, otherValuesKeeper) {
            super(question, settings);
            this._otherValuesKeeper = otherValuesKeeper;
        }

        _attachHandlersToDOM() {
            super._attachHandlersToDOM();

            this.answers
                .filter((answer) => answer.isOther)
                .forEach((answer) =>
                    this._getAnswerOtherNode(answer.code).on('focus', () => this._onAnswerOtherNodeFocus(answer))
                );
        }

        _onAnswerOtherNodeFocus(answer) {
            if (Utils.isEmpty(this._otherValuesKeeper.storedOtherValues[answer.code])) {
                return;
            }

            this._selectAnswer(answer);
        }
    };
export default StoredOtherValuesMixin;
