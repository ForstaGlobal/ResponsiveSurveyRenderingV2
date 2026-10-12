import Question from '../base/question';
import Utils from 'utils.js';
import ValidationTypes from '../validation/validation-types';
import RuleValidationResult from '../validation/rule-validation-result';

/**
 * @desc File upload question.
 * @extends {Question}
 */
export default class FileUploadQuestion extends Question {
    /**
     *
     * @param {object} model - Raw question model.
     * @param {MediaUploader} uploader - File uploader
     */
    constructor(model, uploader) {
        super(model);

        this._fileId = model.fileId;

        this._allowedMimeTypes = model.allowedMimeTypes || [];
        this._maxFileSize = model.maxFileSize;

        this._uploader = uploader;
    }

    /**
     * File uploader. Using to help you to upload file on server during web interview.
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

        if (!Utils.isEmpty(this._fileId)) {
            form[this.id] = this._fileId;
        }

        return form;
    }

    /**
     * Allowed mime types for upload
     * @type {Array<string>}
     * @readonly
     */
    get allowedMimeTypes() {
        return this._allowedMimeTypes;
    }

    /**
     * Max file size for upload
     * @type {number}
     * @readonly
     */
    get maxFileSize() {
        return this._maxFileSize;
    }

    /**
     * Uploaded file id.
     * @type {string}
     * * @readonly
     */

    get value() {
        return { fileId: this._fileId };
    }

    /**
     * Set answer value.
     * @param {string} fileId - File ID.
     */
    setValue(fileId) {
        this._setValueInternal('value', () => this._setValue(fileId), this._diffPrimitives);
    }

    /**
     * Clear question values.
     */
    clearValues() {
        this._clearValuesInternal('value', () => this._clearValues(), this._diffPrimitives);
    }

    _setValue(fileId) {
        if (this._isCatiReviewingMode) {
            return false;
        }

        const newFileId = Utils.isEmpty(fileId) ? null : fileId.toString();

        if (fileId === this._fileId) {
            return false;
        }

        if (newFileId === null) {
            this._fileId = null;
            return true;
        }

        this._fileId = newFileId;

        return true;
    }

    _clearValues() {
        if (!this._fileId) {
            return false;
        }

        this._fileId = null;

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

        let isValid = !Utils.isEmpty(this._fileId);
        return new RuleValidationResult(isValid);
    }
}
