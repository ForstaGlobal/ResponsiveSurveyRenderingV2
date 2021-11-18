import Grid3dMobileInnerQuestionViewMixin from "./grid-3d-mobile-inner-question-view-mixin";
import RankByNumberQuestionView from "../../rank-by-number-question-view";

export default class Grid3DMobileInnerRankByNumberQuestionView  extends Grid3dMobileInnerQuestionViewMixin(RankByNumberQuestionView) {
    constructor(parentQuestion, question, settings = null) {
        super(parentQuestion, question, settings);
    }

    _isAnswerSelected(answer) {
        return this._question.values[answer.code] !== undefined
    }

    _onAnswerOtherNodeValueChange(answerCode, value) {
        this._parentQuestion.setOtherValue(answerCode, value);
    }
}