import ImageUploader from './image-uploader';

/*TODO get rid of it when migrate to V3 and MediaUploader*/
export default class TestModeImageUploader extends ImageUploader {
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
        const imagePreviewUrl = URL.createObjectURL(this._data);
        const imageId = imagePreviewUrl.split('/')[3];
        this._uploadCompleteEvent.trigger({ imageId, imagePreviewUrl });
        this._data = null;
    }
}
