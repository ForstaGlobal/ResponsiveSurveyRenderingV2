import GridQuestionBase from './grid-question-base';

/**
 * @extends {GridQuestionBase}
 */
export default class GridRatingQuestion extends GridQuestionBase {
    /**
     * Create instance.
     * @param {object} model - The instance of the model.
     */
    constructor(model) {
        super(model);

        this._carousel = model.carousel || false;
        this._scaleItems = [];
        this._nonScaleItems = [];

        this._loadScales(model);
    }

    /**
     * Is it carousel.
     * @type {boolean}
     * @readonly
     */
    get carousel() {
        return this._carousel;
    }

    /**
     * Scales in rating scale; If option "Exclude Non-scored" is enabled, it contains only scales with score.
     * @type {Scale[]}
     * @readonly
     */
    get scaleItems() {
        return [...this._scaleItems];
    }

    /**
     * Scales not in rating scale; If option "Exclude Non-scored" is enabled, it contains only scales without score, Otherwise it's empty collection.
     * @type {Scale[]}
     * @readonly
     */
    get nonScaleItems() {
        return [...this._nonScaleItems];
    }

    _loadScales({ scaleItems = [], nonScaleItems = [] }) {
        this._scaleItems = this.getScales(scaleItems);
        this._nonScaleItems = this.getScales(nonScaleItems);
    }
}
