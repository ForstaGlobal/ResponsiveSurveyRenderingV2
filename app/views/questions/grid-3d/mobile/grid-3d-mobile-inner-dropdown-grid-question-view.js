import Grid3dMobileInnerQuestionViewMixin from "./grid-3d-mobile-inner-question-view-mixin";
import DropdownGridQuestionView from "./../../dropdown-grid-question-view";

export default class Grid3DMobileInnerDropdownGridQuestionView extends Grid3dMobileInnerQuestionViewMixin(DropdownGridQuestionView) {
    constructor(question, innerQuestion, settings = null) {
        super(question, innerQuestion, settings);
    }

    _isAnswerSelected(answer) {
        return this._question.values[answer.code] !== undefined
    }

    _onAnswerOtherNodeValueChange(answer, value) {
        this._parentQuestion.setOtherValue(answer.code, value);
    }
}