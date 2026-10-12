import QuestionView from './base/question-view.js';
import UploadProgress from '../controls/upload-progress';

export default class FileUploadQuestionView extends QuestionView {
    /**
     * @param {FileUploadQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);

        this._storedFileName = null;

        this._fileInputNode = this._getQuestionInputNode();
        this._progressControl = new UploadProgress(this._container.find('.circular-progress'));

        this._baseSelector = 'cf-file-upload';
        this._node = this._container.find(`.${this._baseSelector}`);
        this._uploadButtonNode = this._node.find(`.${this._baseSelector}__upload-button`);
        this._uploadedFileIdNode = this._node.find(`.${this._baseSelector}__uploaded-file-id`);
        this._dropAreaNode = this._node.find(`.${this._baseSelector}__drop-area`);

        this._attachControlHandlers();
    }

    _attachControlHandlers() {
        this._fileInputNode.on('change', this._onFileInputChange.bind(this));
        this._uploadButtonNode.on('click', this._upload.bind(this));

        this._dropAreaNode.on('dragenter', this._onDragEnter.bind(this));
        this._dropAreaNode.on('dragover', this._onDragOver.bind(this));
        this._dropAreaNode.on('dragleave', this._onDragLeave.bind(this));
        this._dropAreaNode.on('drop', this._onDrop.bind(this));

        this._progressControl.cancelEvent.on(this._onUploadProgressCancel.bind(this));

        this._question.uploader.uploadStartEvent.on(this._onUploadingStarted.bind(this));
        this._question.uploader.uploadProgressEvent.on(this._onUploadingProgress.bind(this));
        this._question.uploader.uploadCompleteEvent.on(this._onUploadingCompleted.bind(this));
        this._question.uploader.uploadCancelEvent.on(this._onlUploadingCanceled.bind(this));
        this._question.uploader.uploadErrorEvent.on(this._onUploadingError.bind(this));
    }

    _toggleDragOverCssClass(value) {
        this._dropAreaNode.toggleClass(`${this._baseSelector}__drop-area--dragover`, value);
    }

    _isValidMimeType(mimeType) {
        return this._question.allowedMimeTypes.includes(mimeType);
    }

    /*
       DO NOT remove or change the method
       it is overridden in mobile apps (native camera experience is used instead)
   */
    _upload() {
        this._question.setValue(null);
        this._fileInputNode.click();
    }

    _uploadFile(file) {
        if (file.size > this._question.maxFileSize) {
            this._resetControlStateAndShowError(this._settings.messages.fileUploadMaxFileSizeErrorMessage);
            return;
        }

        if (!this._isValidMimeType(file.type)) {
            this._resetControlStateAndShowError(this._settings.messages.fileUploadUnsupportedTypeErrorMessage);
            return;
        }

        this._storedFileName = file.name;
        try {
            this._question.uploader.upload(file);
        } catch (error) {
            this._resetControlStateAndShowError(error.message);
        }
    }

    _showError(error) {
        this._questionErrorBlock.showErrors([error]);
    }

    _hideError() {
        this._hideErrors();
    }

    _changeControlsState(modifier = null) {
        this._node.removeClass(`${this._baseSelector}--uploaded`);
        this._node.removeClass(`${this._baseSelector}--uploading`);

        if (modifier !== null) {
            this._node.addClass(`${this._baseSelector}--${modifier}`);
        }
    }

    _resetControlStateAndShowError(error) {
        this._changeControlsState();
        this._showError(error);

        this.pending = false;
    }

    _onUploadingStarted() {
        this._progressControl.start();

        this._changeControlsState('uploading');
        this.pending = true;
    }

    _onUploadingProgress(value) {
        this._progressControl.progress(value);
    }

    _onUploadingCompleted({ mediaFileId }) {
        this._question.setValue(mediaFileId);
        this.pending = false;
    }

    _onUploadingError(errorMessage) {
        this._showError(errorMessage);
        this._changeControlsState();

        this.pending = false;
    }

    _onFileInputChange(event) {
        if (event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];

        this._uploadFile(file);

        event.target.value = '';
    }

    async _onModelValueChange() {
        this._hideError();

        if (!this._question.value.fileId) {
            this._changeControlsState();
            return;
        }

        this._uploadedFileIdNode.text(this._storedFileName);
        this._changeControlsState('uploaded');
    }

    _onUploadProgressCancel() {
        this._question.uploader.cancel();
    }

    _onlUploadingCanceled() {
        this.pending = false;
        this._changeControlsState();
    }

    _onDragEnter(event) {
        event.preventDefault();

        const files = event.originalEvent.dataTransfer.items;
        if (files.length === 0 || files.length > 1 || this.pending || !this._isValidMimeType(files[0].type)) {
            return;
        }

        this._toggleDragOverCssClass(true);
    }

    _onDragLeave(event) {
        event.preventDefault();
        this._toggleDragOverCssClass(false);
    }

    _onDragOver(event) {
        event.preventDefault(); //prevents open file when drop
    }

    _onDrop(event) {
        event.preventDefault();

        this._toggleDragOverCssClass(false);

        const file = event.originalEvent.dataTransfer.files[0];

        if (this.pending) {
            return;
        }

        this._uploadFile(file);

        event.target.value = '';
    }
}
