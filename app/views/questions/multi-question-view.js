import MultiQuestionViewBase from './multi-question-view-base';
import MultiCountHelper from '../helpers/multi-count-helper';
import StoredOtherValuesMixin from "./base/stored-other-values-mixin";
import {MultiOtherValuesKeeper} from "../helpers/other-values-keeper";

export default class MultiQuestionView extends MultiQuestionViewBase {
    /**
     * @param {MultiQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);
    }

    /**
     * @type {Array} list of selected answer codes
     * @protected
     * @override
     */
    _getSelectedAnswerCodes() {
        return this._question.values;
    }

    /**
     * @param {Answer} answer
     * @protected
     * @override
     */
    _selectAnswer(answer) {
        const isMaxMultiCountReached = MultiCountHelper.isMaxMultiCountReached(this._getSelectedAnswerCodes().length, this._question.multiCount);
        if (isMaxMultiCountReached && !answer.isExclusive) {
            return;
        }

        this._question.setValue(answer.code, true);
    }

    /**
     * @param {Answer} answer
     * @protected
     * @override
     */
    _unselectAnswer(answer) {
        this._question.setValue(answer.code, false);
    }
}

export class MultiQuestionViewWithStoredOtherValues extends StoredOtherValuesMixin(MultiQuestionView) {
    constructor(question, settings) {
        super(question, settings, new MultiOtherValuesKeeper(question, settings));
    }
}