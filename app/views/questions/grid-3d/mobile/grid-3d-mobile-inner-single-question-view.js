import SingleQuestionView from "./../../single-question-view";
import Grid3dMobileInnerQuestionViewMixin from "./grid-3d-mobile-inner-question-view-mixin";

export default class Grid3DMobileInnerSingleQuestionView extends Grid3dMobileInnerQuestionViewMixin(SingleQuestionView) {
    constructor(parentQuestion, question, settings = null) {
        super(parentQuestion, question, settings);
    }

    _onAnswerOtherNodeValueChange(answer, value) {
        super._onAnswerOtherNodeValueChange(answer, value);
        this._parentQuestion.setOtherValue(answer.code, value);
    }

    // eslint-disable-next-line no-unused-vars
    _isAnswerSelected(answer) {
        return this._question.value !== undefined && this._question.value === answer.code;
    }
}