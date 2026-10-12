import MediaUploader from './media-uploader';

export default class TestModeMediaUploader extends MediaUploader {
    constructor() {
        super(null);

        this._data = null;
    }

    upload(data) {
        this._data = data;
        this._uploadStartEvent.trigger();
        this._onUploadCompleteHandler();
    }

    cancel() {
        this._uploadCancelEvent.trigger();
        this._data = null;
    }

    _onUploadCompleteHandler() {
        const mediaFileUrl = URL.createObjectURL(this._data);
        const mediaFileId = mediaFileUrl.split('/')[3];
        this._uploadCompleteEvent.trigger({ mediaFileId, mediaFileUrl });
        this._data = null;
    }
}
