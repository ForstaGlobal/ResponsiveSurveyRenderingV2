import Utils from "../../utils";

/**
 * @abstract
 */
export class OtherValuesKeeper {
    constructor(question) {
        this._question = question;
        this._storedOtherValues = {...this._question.otherValues};

        this._question.changeEvent.on(changes => {
            this._syncStoredOtherValuesWithModel(this._getChangedAnswerCodes(changes), this._getSelectedAnswerCodes());
        });
    }

    get storedOtherValues() { return this._storedOtherValues; }

    /**
     * @abstract
     * @param {object} eventData - Question model changes data
     * @return {string[]}
     */
    // eslint-disable-next-line no-unused-vars
    _getChangedAnswerCodes(eventData) {
        throw 'Not implemented';
    }

    /**
     * @abstract
     * @return {string[]}
     */
    _getSelectedAnswerCodes() {
        throw 'Not implemented';
    }

    _syncStoredOtherValuesWithModel(changedAnswerCodes = [], selectedAnswerCodes = []) {
        changedAnswerCodes.forEach(answerCode => {
            const isSelected = selectedAnswerCodes.includes(answerCode);

            if (isSelected && !Utils.isEmpty(this._storedOtherValues[answerCode])) {
                this._question.setOtherValue(answerCode, this._storedOtherValues[answerCode]);
                delete this._storedOtherValues[answerCode];
                return;
            }

            if (!isSelected && !Utils.isEmpty(this._question.otherValues[answerCode])) {
                this._storedOtherValues[answerCode] = this._question.otherValues[answerCode];
                this._question.setOtherValue(answerCode, null);
            }
        });
    }
}

export class SingleOtherValuesKeeper extends OtherValuesKeeper {
    _getChangedAnswerCodes({previousState: {value = null}}) {
        return (value !== null ? [this._question.value, value] : [this._question.value]);
    }

    _getSelectedAnswerCodes() {
        return [this._question.value];
    }
}

export class MultiOtherValuesKeeper extends OtherValuesKeeper {
    _getChangedAnswerCodes({changes}) {
        return changes.values;
    }

    _getSelectedAnswerCodes() {
        return this._question.values;
    }
}

export class RankingOtherValuesKeeper extends OtherValuesKeeper {
    _getChangedAnswerCodes({changes}) {
        return changes.values
    }

    _getSelectedAnswerCodes() {
        return Object.keys(this._question.values);
    }
}