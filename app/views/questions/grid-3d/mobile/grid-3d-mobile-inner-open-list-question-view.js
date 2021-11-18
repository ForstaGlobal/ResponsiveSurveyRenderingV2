import Grid3dMobileInnerQuestionViewMixin from "./grid-3d-mobile-inner-question-view-mixin";
import OpenTextListQuestionView from "./../../open-text-list-question-view";

export default class Grid3DMobileInnerOpenListQuestionView extends Grid3dMobileInnerQuestionViewMixin(OpenTextListQuestionView) {
    constructor(question, innerQuestion, settings = null) {
        super(question, innerQuestion, settings);
    }

    _isAnswerSelected(answer) {
        return this._question.values[answer.code] !== undefined
    }

    _onAnswerOtherNodeValueChange(answerCode, value) {
        this._parentQuestion.setOtherValue(answerCode, value);
    }
}