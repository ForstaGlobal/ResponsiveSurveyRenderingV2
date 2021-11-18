import Utils from './../../utils';
import MultiQuestionViewBase from './multi-question-view-base';
import MultiCountHelper from '../helpers/multi-count-helper';
import StoredOtherValuesMixin from "./base/stored-other-values-mixin";
import {RankingOtherValuesKeeper} from "../helpers/other-values-keeper";

export default class CaptureOrderMultiQuestionView extends MultiQuestionViewBase {
    /**
     * @param {RankingQuestion} question
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
        return Object.keys(this._question.values);
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

        const maxValue = this._getSelectedAnswerCodes().length;
        this._question.setValue(answer.code, maxValue + 1);

        if (answer.isOther && Utils.isEmpty(this._question.otherValues[answer.code])) {
            this._getAnswerOtherNode(answer.code).focus();
        }
    }

    /**
     * @param {Answer} answer
     * @protected
     * @override
     */
    _unselectAnswer(answer) {
        const unselectedAnswerValue = this._question.values[answer.code];

        this._question.setValue(answer.code, null);
        Object.entries(this._question.values).forEach(([code, value]) => {
            if (value > unselectedAnswerValue) {
                this._question.setValue(code, value - 1);
            }
        });
    }
}

export class CaptureOrderMultiQuestionViewWithStoredOtherValues extends StoredOtherValuesMixin(CaptureOrderMultiQuestionView) {
    constructor(question, settings) {
        super(question, settings, new RankingOtherValuesKeeper(question, settings));
    }
}