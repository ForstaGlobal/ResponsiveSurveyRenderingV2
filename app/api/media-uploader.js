import Event from 'event.js';

export default class MediaUploader {
    constructor(uploadUrl) {
        this._uploadUrl = uploadUrl;
        this._xhr = null;

        this._uploadStartEvent = new Event('media-uploader:start');
        this._uploadProgressEvent = new Event('media-uploader:progress');
        this._uploadCompleteEvent = new Event('media-uploader:complete');
        this._uploadCancelEvent = new Event('media-uploader:cancel');
        this._uploadErrorEvent = new Event('media-uploader:error');
    }

    get uploadStartEvent() {
        return this._uploadStartEvent;
    }

    get uploadProgressEvent() {
        return this._uploadProgressEvent;
    }

    get uploadCompleteEvent() {
        return this._uploadCompleteEvent;
    }

    get uploadCancelEvent() {
        return this._uploadCancelEvent;
    }

    get uploadErrorEvent() {
        return this._uploadErrorEvent;
    }

    upload(mediaFile, durationInSeconds) {
        this._uploadStartEvent.trigger();

        this._xhr = new XMLHttpRequest();
        this._xhr.open('POST', this._uploadUrl, true);
        this._xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        this._xhr.setRequestHeader('pragma', 'no-cache');
        this._xhr.addEventListener('load', this._onUploadCompleteHandler.bind(this), false);
        this._xhr.addEventListener('error', this._onUploadErrorHandler.bind(this), false);
        this._xhr.upload.addEventListener('progress', this._onProgressUploadHandler.bind(this), false);

        const formData = new FormData();
        formData.append('file', mediaFile);
        formData.append('durationInSeconds', durationInSeconds);
        formData.append('uploadStarted', Date.now().toString());

        this._xhr.send(formData);
    }

    cancel() {
        if (this._xhr === null) {
            return;
        }

        this._xhr.abort();
        this._uploadCancelEvent.trigger();
    }

    _onProgressUploadHandler(progressEvent) {
        if (!progressEvent.lengthComputable) {
            return;
        }
        const percentComplete = parseInt((progressEvent.loaded / progressEvent.total) * 100, 10);
        this._uploadProgressEvent.trigger(percentComplete);
    }

    _onUploadCompleteHandler() {
        let response;
        try {
            try {
                response = JSON.parse(this._xhr.responseText);
            } finally {
                this._xhr = null;
            }
        } catch {
            this._uploadErrorEvent.trigger('File uploader error: invalid JSON');
            return;
        }

        if (response.error) {
            this._uploadErrorEvent.trigger('File uploader error: ' + response.error);
            return;
        }

        this._uploadCompleteEvent.trigger({ mediaFileId: response.mediaFileId, mediaFileUrl: response.mediaFileUrl });
    }

    _onUploadErrorHandler() {
        this._xhr = null;
        this._uploadErrorEvent.trigger('File uploader error: an error occurred while transferring the file.');
    }
}
