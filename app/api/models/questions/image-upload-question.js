import Question from '../base/question';
import Utils from 'utils.js';

/**
 * @desc Image upload question.
 * @extends {Question}
 */
export default class ImageUploadQuestion extends Question {
    /**
     *
     * @param {object} model - Raw question model.
     * @param {ImageUploader} uploader - Image uploader
     */
    constructor(model, uploader) {
        super(model);

        this._imageId = model.imageId;
        this._imagePreviewUrl = model.imagePreviewUrl;

        this._cameraOnly = model.cameraOnly;
        this._maxImageWidth = model.maxImageWidth;
        this._maxImageHeight = model.maxImageHeight;

        this._uploader = uploader;
    }

    /**
     * Image uploader. Using to help you to upload image on server during web interview.
     * @returns {ImageUploader}
     */
    get uploader() {
        return this._uploader;
    }

    /**
     * @inheritDoc
     */
    get formValues() {
        const form = {};

        if (!Utils.isEmpty(this._imageId)) {
            form[this.id] = this._imageId;
        }

        return form;
    }

    /**
     * Capture image form camera and prevent browse to existing images.
     * @returns {boolean}
     */
    get cameraOnly() {
        return this._cameraOnly;
    }

    /**
     * Maximum size of image width in pixels.
     * @type {number}
     * @readonly
     */
    get maxImageWidth() {
        return this._maxImageWidth;
    }

    /**
     * Maximum size of image height in pixels.
     * @type {number}
     * @readonly
     */
    get maxImageHeight() {
        return this._maxImageHeight;
    }

    /**
     * Image upload value.
     * @type {{imageId: string, imagePreviewUrl: string}}
     * @readonly
     */
    get value() {
        return { imageId: this._imageId, imagePreviewUrl: this._imagePreviewUrl };
    }

    /**
     * Set answer value.
     * @param {string} imageId - Image ID.
     * @param {string} imagePreviewUrl - Image preview URL.
     */
    setValue(imageId, imagePreviewUrl) {
        this._setValueInternal('value', () => this._setValue(imageId, imagePreviewUrl), this._diffPrimitives);
    }

    /**
     * Clear question values.
     */
    clearValues() {
        this._clearValuesInternal('value', () => this._clearValues(), this._diffPrimitives);
    }

    _setValue(imageId, imagePreviewUrl) {
        const newImageId = Utils.isEmpty(imageId) ? null : imageId.toString();
        const newImagePreviewUrl = Utils.isEmpty(imagePreviewUrl) ? null : imagePreviewUrl.toString();

        if (newImageId === this._imageId) {
            return false;
        }

        if (newImageId === null) {
            this._imageId = null;
            this._imagePreviewUrl = null;
            return true;
        }

        this._imageId = newImageId;
        this._imagePreviewUrl = newImagePreviewUrl;
        return true;
    }

    _clearValues() {
        if (!this._imageId && !this._imagePreviewUrl) {
            return false;
        }

        this._imageId = null;
        this._imagePreviewUrl = null;

        return true;
    }
}
