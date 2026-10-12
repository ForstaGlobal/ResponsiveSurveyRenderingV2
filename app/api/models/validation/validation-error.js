/**
 * @class
 * @alias ValidationError
 */
export default class ValidationError {
    /**
     * Create instance.
     * @param {string} type - Validation rule type.
     * @param {string} message - Validate error message.
     * @param {object} data - data object with extra information about validation result.
     */
    constructor(type, message, data = {}) {
        this._type = type;
        this._message = message;
        this._data = data;

        this._processSubstitutions();
    }

    /**
     * Validation rule type.
     * @type {string}
     * @readonly
     */
    get type() {
        return this._type;
    }

    /**
     * Validate error message.
     * @type {string}
     * @readonly
     */
    get message() {
        return this._message;
    }

    /**
     * Data object with extra information about validation result.
     * @type { object }
     * @readonly
     */
    get data() {
        return this._data;
    }

    _processSubstitutions() {
        if (this._message === undefined || this._data.substitutions === undefined) {
            return;
        }

        for (const [key, value] of Object.entries(this._data.substitutions)) {
            this._message = this._message.replaceAll(`^${key}^`, value);
        }
    }
}
