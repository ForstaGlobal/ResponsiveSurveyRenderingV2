import QuestionView from './base/question-view.js';
import ImageProcessor from '../helpers/image-processor.js';
import UploadProgress from '../controls/upload-progress';

export default class ImageUploadQuestionView extends QuestionView {
    /**
     * @param {ImageUploadQuestion} question
     */
    constructor(question) {
        super(question);

        this._question.uploader.uploadProgressEvent.on(this._onUploadProgress.bind(this));
        this._question.uploader.uploadCompleteEvent.on(this._onUploadComplete.bind(this));
        this._question.uploader.uploadCancelEvent.on(this._onUploadCancel.bind(this));
        this._question.uploader.uploadErrorEvent.on(this._onUploadError.bind(this));

        this._imageProcessor = new ImageProcessor();

        this._progressControl = new UploadProgress(this._container.find('.circular-progress'));
        this._progressControl.cancelEvent.on(this._onUploadProgressCancel.bind(this));

        this._fileInputNode = this._getQuestionInputNode();
        this._fileInputNode.on('change', this._onFileInputChange.bind(this));
        const ua = window.navigator.userAgent;
        if (/Android.*Chrome/.test(ua)) this._fileInputNode.attr('accept', 'image/*, plain/text');

        this._answerNode = this._container.find('.cf-image-upload-answer');
        this._previewNode = this._answerNode.find('.cf-image-upload-answer__preview');
        this._uploadButton = this._answerNode.find('.cf-image-upload-answer__upload-button');
        this._uploadButton.on('click', this._upload.bind(this));
    }

    /* this method have to be implemented in view, due to native app override */
    _upload() {
        this._fileInputNode.click();
        this._question.setValue(null, null);
    }

    _showError(error) {
        this._questionErrorBlock.showErrors([error]);
    }

    _hideError() {
        this._hideErrors();
    }

    _resetControlStateAndShowError(error) {
        this._changeControlsState();
        this._showError(error);
    }

    _changeControlsState(modifier) {
        this._answerNode.removeClass('cf-image-upload-answer--uploaded');
        this._answerNode.removeClass('cf-image-upload-answer--process');

        if (modifier === undefined && modifier !== 'uploaded' && modifier !== 'process') {
            return;
        }

        this._answerNode.addClass(`cf-image-upload-answer--${modifier}`);
    }

    async _processAndUploadImage(file) {
        this._progressControl.start();
        this._changeControlsState('process');

        const blob = await this._processImage(file, this._question.maxImageWidth, this._question.maxImageHeight);

        if (this._progressControl.canceled === true) {
            this._changeControlsState();
            return;
        }

        this._uploadImage(blob);
    }

    async _processImage(file, maxImageWidth, maxImageHeight) {
        if (!file.type) {
            this._resetControlStateAndShowError('Unsupported file type');
            return;
        }

        if (/^image\/.*$/.test(file.type) === false) {
            this._resetControlStateAndShowError('Only image files allowed.');
            return;
        }

        let blob;
        try {
            blob = await this._imageProcessor.process(file, maxImageWidth, maxImageHeight);
        } catch (error) {
            this._resetControlStateAndShowError(error.message);
            return;
        }

        return blob;
    }

    _uploadImage(blob) {
        if (blob === undefined) {
            return;
        }

        try {
            this._question.uploader.upload(blob);
        } catch (error) {
            this._resetControlStateAndShowError(error.message);
        }
    }

    async _loadPreviewImage(url) {
        return new Promise(resolve => {
            const image = new Image();
            image.className = 'cf-image-upload-answer__preview-image';
            image.onload = () => {
                resolve(image);
            };
            image.src = url;
        });
    }

    async _showPreviewImage(imagePreviewUrl) {
        const image = await this._loadPreviewImage(imagePreviewUrl);
        this._previewNode.append(image);
    }

    async _onModelValueChange() {
        this._previewNode.find('.cf-image-upload-answer__preview-image').remove();
        this._hideError();

        if (this._question.value.imageId === null) {
            this._changeControlsState();
            return;
        }

        await this._showPreviewImage(this._question.value.imagePreviewUrl);
        this._changeControlsState('uploaded');
    }

    _onUploadProgressCancel() {
        this._question.uploader.cancel();
    }

    _onUploadProgress(progressValue) {
        this._progressControl.progress(progressValue);
    }

    _onUploadComplete({ imageId, imagePreviewUrl }) {
        this._progressControl.finish();
        this._question.setValue(imageId, imagePreviewUrl);

        this.pending = false;
    }

    _onUploadCancel() {
        this._changeControlsState();
    }

    _onUploadError(error) {
        this._progressControl.finish();
        this._showError(error);

        this.pending = false;
    }

    _onFileInputChange(event) {
        if (event.target.files.length === 0) {
            return;
        }

        this.pending = true;
        const file = event.target.files[0];

        this._processAndUploadImage(file);
        event.target.value = '';
    }
}
