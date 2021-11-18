import Grid3dMobileInnerQuestionViewMixin from "./grid-3d-mobile-inner-question-view-mixin";
import MultiQuestionView from "../../multi-question-view";

export default class Grid3DMobileInnerMultiQuestionView extends Grid3dMobileInnerQuestionViewMixin(MultiQuestionView) {
    constructor(parentQuestion, question, settings = null) {
        super(parentQuestion, question, settings);
    }

    _isAnswerSelected(answer) {
        return this._isSelected(answer);
    }

    _onAnswerOtherNodeValueChange(answer, value) {
        super._onAnswerOtherNodeValueChange(answer, value);
        this._parentQuestion.setOtherValue(answer.code, value);
    }
}