import QuestionWithAnswers from '../base/question-with-answers';

/**
 * @desc Chart single question.
 * @extends {QuestionWithAnswers}
 */
export default class ChartSingleQuestion extends QuestionWithAnswers {
    /**
     *
     * @param {object} model - Raw question model.
     */
    constructor(model) {
        super(model);

        this._chartScale = model.chartScale || {};
        this._chartTotal = model.chartTotal || 0;
    }

    /**
     * Chart scale
     * @type {Map<string, {value: number, valueInPercent: number}>}
     * @readonly
     */
    get chartScale() {
        return this._chartScale;
    }

    /**
     * Chart total
     * @type {number}
     * @readonly
     */
    get chartTotal() {
        return this._chartTotal;
    }
}
