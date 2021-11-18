import MobileGridBarsGridQuestionView from "./../../grid-bars-grid/mobile-grid-bars-grid-question-view";
import Grid3dMobileInnerQuestionViewMixin from "./grid-3d-mobile-inner-question-view-mixin";

export default class Grid3DMobileInnerGridBarsGridQuestionView extends Grid3dMobileInnerQuestionViewMixin(MobileGridBarsGridQuestionView) {
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