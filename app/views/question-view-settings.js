/**
 * @desc Question view settings.
 */
export default class QuestionViewSettings {
    /**
     * @param {SurveyInfo} surveyInfo
     */
    constructor(surveyInfo) {
        this._mobileThreshold = parseInt(surveyInfo.mobileThreshold);
        this._disableKeyboardSupport = surveyInfo.surveyChannel === 'Cati';
        this._isAccessible = surveyInfo.isAccessible;
        this._messages = {
            noResponse: surveyInfo.messages.noResponseMessage,
        };
        this._renderingVersion = surveyInfo.renderingVersion;
    }

    /**
     * Determine when switch between mobile and desktop layouts.
     * @returns {string}
     * @readonly
     */
    get mobileThreshold() {
        return this._mobileThreshold;
    }

    /**
     * Get disable keyword support.
     * @returns {boolean}
     */
    get disableKeyboardSupport() {
        return this._disableKeyboardSupport;
    }

    /**
     * Set disable keyword support.
     * @param {boolean} value
     */
    set disableKeyboardSupport(value) {
        this._disableKeyboardSupport = value;
    }

    /**
     * Is survey executing in accessibility mode.
     * @type {boolean}
     * @readonly
     */
    get isAccessible() {
        return this._isAccessible;
    }

    /**
     * Resource messages.
     * @return {object} Messages dictionary.
     */
    get messages() {
        return this._messages;
    }

    /**
     * Survey rendering version
     * @type {string}
     * @readonly
     */
    get renderingVersion() {
        return this._renderingVersion;
    }
}
