import Question from '../base/question';
import Utils from 'utils';
import ValidationTypes from '../validation/validation-types';
import RuleValidationResult from '../validation/rule-validation-result';

/**
 * @desc AudioUploadQuestion.
 * @extends {Question}
 */
export default class AudioUploadQuestion extends Question {
    /**
     * @param {object} model - Raw question model.
     * @param {MediaUploader} uploader - Audio uploader
     */
    constructor(model, uploader) {
        super(model);

        this._audioId = model.audioId;
        this._previewUrl = model.previewUrl;
        this._duration = null;

        this._minDurationInSeconds = model.minDurationInSeconds;
        this._maxDurationInSeconds = model.maxDurationInSeconds;

        this._uploader = uploader;
    }

    /**
     * Media uploader. Using to help you to upload audio on server during web interview.
     * @returns {MediaUploader}
     */
    get uploader() {
        return this._uploader;
    }

    /**
     * @inheritDoc
     */
    get formValues() {
        const form = {};

        if (!Utils.isEmpty(this._audioId)) {
            form[this.id] = this._audioId;
        }

        return form;
    }

    /**
     * Minimum duration of audio file in seconds.
     * @type {number}
     * @readonly
     */
    get minDurationInSeconds() {
        return this._minDurationInSeconds;
    }

    /**
     * Maximum duration of audio file in seconds.
     * @type {number}
     * @readonly
     */
    get maxDurationInSeconds() {
        return this._maxDurationInSeconds;
    }

    /**
     * Audio upload value.
     * @type {{audioId: ?string, previewUrl: ?string, duration: ?number}}
     * @readonly
     */
    get value() {
        return { audioId: this._audioId, previewUrl: this._previewUrl, duration: this._duration };
    }

    /**
     * Set answer value.
     * @param {string} audioId - Audio ID.
     * @param {string} previewUrl - Audio preview URL.
     * @param {number} duration - Audio file duration in seconds.
     */
    setValue(audioId, previewUrl, duration) {
        this._setValueInternal('value', () => this._setValue(audioId, previewUrl, duration), this._diffPrimitives);
    }

    /**
     * Clear question values.
     */
    clearValues() {
        this._clearValuesInternal('value', () => this._clearValues(), this._diffPrimitives);
    }

    _setValue(audioId, previewUrl, duration) {
        if (this._isCatiReviewingMode) {
            return false;
        }

        const newAudioId = Utils.isEmpty(audioId) ? null : audioId.toString();
        const newPreviewUrl = Utils.isEmpty(previewUrl) ? null : previewUrl.toString();

        if (newAudioId === this._audioId) {
            return false;
        }

        if (newAudioId === null) {
            this._audioId = null;
            this._previewUrl = null;
            return true;
        }

        this._audioId = newAudioId;
        this._previewUrl = newPreviewUrl;
        this._duration = duration;

        return true;
    }

    _clearValues() {
        if (!this._audioId && !this._previewUrl && !this._duration) {
            return false;
        }

        this._audioId = null;
        this._previewUrl = null;
        this._duration = null;

        return true;
    }

    _validateRule(validationType) {
        switch (validationType) {
            case ValidationTypes.Required:
                return this._validateRequired();
        }
    }

    _validateRequired() {
        if (!this.required) return new RuleValidationResult(true);

        let isValid = !Utils.isEmpty(this._audioId);
        return new RuleValidationResult(isValid);
    }
}
