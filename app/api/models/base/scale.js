import AnswerImagesSettings from './answer-images-settings';

/**
 * @desc A class for Scale
 */

export default class Scale {
    /**
     * @param {object} model - Group name.
     * @param {HeadGroup} group - Reference to a group, if the scale is inside one.
     */
    constructor(model, group) {
        this._code = null;
        this._score = null;
        this._text = null;
        this._imagesSettings = null;
        this._backgroundColor = null;
        this._group = group || null;

        this._parseModel(model);
    }

    /**
     * Answer code.
     * @type {string}
     * @readonly
     */
    get code() {
        return this._code;
    }

    /**
     * Scale score.
     * @type {number}
     * @readonly
     */
    get score() {
        return this._score;
    }

    /**
     * Answer text.
     * @type {string}
     * @readonly
     */
    get text() {
        return this._text;
    }

    /**
     * Reference to a group, if the scale is inside one.
     * @type {HeadGroup}
     * @readonly
     */
    get group() {
        return this._group;
    }

    /**
     * Scale images settings
     * @type {AnswerImagesSetting}
     * @readonly
     */
    get imagesSettings() {
        return this._imagesSettings;
    }

    /**
     * Scale background color.
     * @type {string}
     * @readonly
     */
    get backgroundColor() {
        return this._backgroundColor;
    }

    _parseModel(model) {
        this._text = model.text;
        this._code = model.code;
        this._score = model.score;
        this._backgroundColor = model.backgroundColor;
        if (model.imagesSettings) {
            this._imagesSettings = new AnswerImagesSettings(model.imagesSettings);
        }
    }
}
