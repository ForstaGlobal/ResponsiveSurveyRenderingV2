import GridQuestionBase from './grid-question-base';

/**
 * @desc Chart grid question.
 * @extends {GridQuestionBase}
 */
export default class ChartGridQuestion extends GridQuestionBase {
    /**
     *
     * @param {object} model - Raw question model.
     */
    constructor(model) {
        super(model);

        this._chartScales = model.chartScales || {};
        this._chartTotal = model.chartTotal || 0;
    }

    /**
     * Chart scales
     * @type {Map<string, Map<string, {value: number, valueInPercent: number}>>}
     * @readonly
     */
    get chartScales() {
        return this._chartScales;
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
