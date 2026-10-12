import VideoUploadQuestionViewBase from './video-upload-question-view-base';
import MobileQuestionIdProvider from '../../helpers/mobile-question-id-provider';

export default class MobileVideoUploadView extends VideoUploadQuestionViewBase {
    /**
     * @param {VideoUploadQuestion} question
     * @param {MediaCaptureManager} mediaCaptureManager
     * @param {QuestionViewSettings} settings
     */
    constructor(question, mediaCaptureManager, settings) {
        super(question, mediaCaptureManager, settings);

        this._baseSelector = 'cf-mobile-video-upload';

        this._init();
        this._attachHandlers();
    }

    _createIdProvider(questionId) {
        return new MobileQuestionIdProvider(questionId);
    }

    _init() {
        super._init();

        this._swapCameraButton = this._node.find(`.${this._baseSelector}__swap-camera-button`);
    }

    _attachHandlers() {
        super._attachHandlers();
        this._swapCameraButton.on('click', this._swapCamera.bind(this));
    }

    _swapCamera() {
        if (this._mediaCaptureManager.cameraList.length < 2) {
            return;
        }

        const frontCamera =
            this._mediaCaptureManager.cameraList.find(this._isFrontCamera) ?? this._mediaCaptureManager.cameraList[0];

        const backCamera =
            this._mediaCaptureManager.cameraList.find(this._isBackCamera) ?? this._mediaCaptureManager.cameraList[1];

        if (this._mediaCaptureManager.selectedCamera.deviceId === frontCamera.deviceId) {
            this._mediaCaptureManager.selectCamera(backCamera);
        } else {
            this._mediaCaptureManager.selectCamera(frontCamera);
        }

        this._mediaCaptureManager.startCapturing();
    }
}
