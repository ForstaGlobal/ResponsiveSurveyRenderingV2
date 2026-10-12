import QuestionView from '../base/question-view';
import Utils from 'utils';
import UploadProgress from '../../controls/upload-progress';

export default class VideoUploadQuestionViewBase extends QuestionView {
    /**
     * @param {VideoUploadQuestion} question
     * @param {MediaCaptureManager} mediaCaptureManager
     * @param {QuestionViewSettings} settings
     */
    constructor(question, mediaCaptureManager, settings) {
        super(question, settings);

        this._minDurationInSeconds = this._question.minDurationInSeconds;
        this._maxDurationInSeconds = this._question.maxDurationInSeconds;
        if (!this._maxDurationInSeconds || this._maxDurationInSeconds > 300) {
            this._maxDurationInSeconds = 300;
        }

        this._mediaCaptureManager = mediaCaptureManager;
        this._progressControl = new UploadProgress(this._container.find('.circular-progress'));

        this._prepareTimeoutInSeconds = 3;
        this._recordingDurationInSeconds = 0;
    }

    _init() {
        this._node = this._container.find('.cf-media-upload');

        this._mediaUploadControls = this._node.find('.cf-media-upload__controls');

        this._videoRecording = this._node.find(`.${this._baseSelector}`);

        this._previewVideoPlayer = this._node.find(`.${this._baseSelector}__preview`)[0];
        this._recordedVideoPlayer = this._node.find(`.${this._baseSelector}__record`)[0];

        this._timer = this._node.find(`.${this._baseSelector}__timer`);
        this._timerCounterLabel = this._timer.find(`.${this._baseSelector}__timer-counter-label`);
        this._timerProgress = this._timer.find('.circular-progress__progress');
        this._timerProgressCircumference = 2 * Math.PI * parseInt(this._timerProgress.attr('r'));
        this._timerProgress.attr('stroke-dasharray', this._timerProgressCircumference);

        this._recordingDurationLabel = this._node.find(`.${this._baseSelector}__duration-label`);
        this._updateRecordingDurationLabel();

        this._pauseIcon = this._node.find(`.${this._baseSelector}__pause-icon`);

        this._closeButton = this._node.find(`.${this._baseSelector}__close-button`);
        this._recordButton = this._node.find(`.${this._baseSelector}__record-button`);
        this._pauseButton = this._node.find(`.${this._baseSelector}__pause-button`);
        this._resumeButton = this._node.find(`.${this._baseSelector}__resume-button`);
        this._stopButton = this._node.find(`.${this._baseSelector}__stop-button`);
        this._retakeButton = this._node.find(`.${this._baseSelector}__retake-button`);
        this._doneButton = this._node.find(`.${this._baseSelector}__done-button`);
        this._cancelUploadButton = this._node.find(`.${this._baseSelector}__cancel-upload-button`);
        this._retryUploadButton = this._node.find(`.${this._baseSelector}__retry-button`);

        this._errorMessage = this._node.find(`.${this._baseSelector}__error-message`);
        this._errorDetails = this._node.find(`.${this._baseSelector}__error-details`);

        this._uploadedVideoPreview = this._node.find('.cf-video-preview');

        this._uploadedVideoPlayer = this._node.find('.cf-video-preview__video-player')[0];
        this._uploadedVideoDurationLabel = this._node.find('.cf-video-preview__duration-label');

        this._closeUploadedVideoButton = this._node.find(`.cf-video-preview__back-button`);
    }

    _attachHandlers() {
        this._pauseIcon.on('click', this._resumeRecording.bind(this));

        this._closeButton.on('click', this._reset.bind(this));
        this._recordButton.on('click', this._startRecording.bind(this));
        this._pauseButton.on('click', this._pauseRecording.bind(this));
        this._resumeButton.on('click', this._resumeRecording.bind(this));
        this._stopButton.on('click', this._stopRecording.bind(this));
        this._retakeButton.on('click', this._retake.bind(this));
        this._doneButton.on('click', this._startUploading.bind(this));
        this._cancelUploadButton.on('click', this._cancelUploading.bind(this));
        this._retryUploadButton.on('click', this._startUploading.bind(this));

        this._closeUploadedVideoButton.on('click', this._closeUploadedVideo.bind(this));

        this._mediaCaptureManager.mediaDeviceSelectionChangedEvent.on(this._onMediaDeviceSelectionChanged.bind(this));
        this._mediaCaptureManager.capturingStartedEvent.on(this._onCapturingStarted.bind(this));
        this._mediaCaptureManager.preparingStartedEvent.on(this._onPreparingStarted.bind(this));
        this._mediaCaptureManager.recordingStartedEvent.on(this._onRecordingStarted.bind(this));
        this._mediaCaptureManager.recordingDurationUpdatedEvent.on(this._onRecordingDurationUpdated.bind(this));
        this._mediaCaptureManager.recordingPausedEvent.on(this._onRecordingPaused.bind(this));
        this._mediaCaptureManager.recordingResumedEvent.on(this._onRecordingResumed.bind(this));
        this._mediaCaptureManager.recordedDataAvailableEvent.on(this._onRecordedDataAvailable.bind(this));
        this._mediaCaptureManager.retakeEvent.on(this._onRetake.bind(this));
        this._mediaCaptureManager.resetEvent.on(this._onReset.bind(this));
        this._mediaCaptureManager.errorEvent.on(this._onError.bind(this));

        this._question.uploader.uploadStartEvent.on(this._onUploadingStarted.bind(this));
        this._question.uploader.uploadProgressEvent.on(this._onUploadingProgress.bind(this));
        this._question.uploader.uploadCompleteEvent.on(this._onUploadingCompleted.bind(this));
        this._question.uploader.uploadCancelEvent.on(this._onlUploadingCanceled.bind(this));
        this._question.uploader.uploadErrorEvent.on(this._onUploadingError.bind(this));

        this._progressControl.cancelEvent.on(this._cancelUploading.bind(this));
    }

    _setState(state = null) {
        this._videoRecording.removeClass(`${this._baseSelector}--initializing`);
        this._videoRecording.removeClass(`${this._baseSelector}--previewing`);
        this._videoRecording.removeClass(`${this._baseSelector}--preparing`);
        this._videoRecording.removeClass(`${this._baseSelector}--recording`);
        this._videoRecording.removeClass(`${this._baseSelector}--paused`);
        this._videoRecording.removeClass(`${this._baseSelector}--recorded`);
        this._videoRecording.removeClass(`${this._baseSelector}--uploading`);
        this._videoRecording.removeClass(`${this._baseSelector}--error`);
        this._videoRecording.removeClass(`${this._baseSelector}--upload-error`);

        if (state !== null) {
            this._videoRecording.addClass(`${this._baseSelector}--${state}`);
        }
    }

    openRecording() {
        this._node.addClass('cf-media-upload--recording');
        this._node.removeClass('cf-media-upload--uploaded');
        this._setState('initializing');
    }

    _reset() {
        this._mediaCaptureManager.reset();
    }

    _onReset() {
        this._previewVideoPlayer.pause();
        this._previewVideoPlayer.srcObject = null;
        this._recordedVideoPlayer.pause();
        this._recordedVideoPlayer.srcObject = null;

        this._recordingDurationInSeconds = 0;
        this._updateRecordingDurationLabel();

        this._setState();
        this._node.removeClass('cf-media-upload--recording');
        this._mediaUploadControls.removeClass('cf-media-upload__controls--hidden');
    }

    _onMediaDeviceSelectionChanged() {
        const selectedCamera = this._mediaCaptureManager.selectedCamera;

        if (this._isFrontCamera(selectedCamera)) {
            this._previewVideoPlayer.classList.add(`${this._baseSelector}__preview--mirrored`);
            return;
        }

        if (this._isBackCamera(selectedCamera)) {
            this._previewVideoPlayer.classList.remove(`${this._baseSelector}__preview--mirrored`);
        }
    }

    _isFrontCamera(cameraDevice) {
        return (
            (cameraDevice.label && cameraDevice.label.toLowerCase().includes('front')) ||
            (cameraDevice.deviceId && cameraDevice.deviceId.toLowerCase().includes('front'))
        );
    }

    _isBackCamera(cameraDevice) {
        return (
            (cameraDevice.label && cameraDevice.label.toLowerCase().includes('back')) ||
            (cameraDevice.deviceId && cameraDevice.deviceId.toLowerCase().includes('back'))
        );
    }

    _onCapturingStarted() {
        this._previewVideoPlayer.srcObject = this._mediaCaptureManager.mediaStream;
        this._previewVideoPlayer.play();

        this._setState('previewing');
    }

    _startRecording() {
        this._mediaCaptureManager.prepare();

        setTimeout(() => {
            this._mediaCaptureManager.startRecording();
        }, this._prepareTimeoutInSeconds * 1000);
    }

    async _onPreparingStarted() {
        this._setState('preparing');

        let timeout = this._prepareTimeoutInSeconds;
        while (timeout > 0) {
            this._timerCounterLabel.text(timeout);
            this._timerProgress.attr(
                'stroke-dashoffset',
                Math.round(
                    (this._timerProgressCircumference * (this._prepareTimeoutInSeconds - timeout)) /
                        this._prepareTimeoutInSeconds
                )
            );

            await new Promise(resolve => setTimeout(resolve, 1000));
            timeout--;
        }
    }

    _onRecordingStarted() {
        this._setState('recording');
    }

    _onRecordingDurationUpdated(recordingDurationInMilliseconds) {
        this._recordingDurationInSeconds = Math.floor(recordingDurationInMilliseconds / 1000);
        this._updateRecordingDurationLabel();

        if (this._minDurationInSeconds && this._recordingDurationInSeconds < this._minDurationInSeconds) {
            this._videoRecording.addClass(`${this._baseSelector}--min-duration-not-reached`);
        } else {
            this._videoRecording.removeClass(`${this._baseSelector}--min-duration-not-reached`);
        }

        if (this._maxDurationInSeconds && this._recordingDurationInSeconds >= this._maxDurationInSeconds) {
            this._stopRecording();
        }
    }

    _updateRecordingDurationLabel() {
        this._recordingDurationLabel.text(
            `${Utils.formatDuration(this._recordingDurationInSeconds)} / ${Utils.formatDuration(
                this._maxDurationInSeconds
            )}`
        );
    }

    _pauseRecording() {
        this._mediaCaptureManager.pauseRecording();
    }

    _onRecordingPaused() {
        this._previewVideoPlayer.pause();
        this._setState('paused');
    }

    _resumeRecording() {
        this._mediaCaptureManager.resumeRecording();
    }

    _onRecordingResumed() {
        this._previewVideoPlayer.play();
        this._setState('recording');
    }

    _stopRecording() {
        if (this._minDurationInSeconds && this._recordingDurationInSeconds < this._minDurationInSeconds) {
            return;
        }

        this._previewVideoPlayer.pause();
        this._mediaCaptureManager.stopRecording();
    }

    _onRecordedDataAvailable() {
        this._previewVideoPlayer.srcObject = null;
        this._recordedVideoPlayer.src = URL.createObjectURL(this._mediaCaptureManager.recordedDataBlob);

        this._setState('recorded');
    }

    _retake() {
        if (!confirm(this._settings.messages.retakeVideo)) {
            return;
        }

        this._recordingDurationInSeconds = 0;
        this._mediaCaptureManager.retake();
    }

    _onRetake() {
        this._recordedVideoPlayer.pause();
        this._recordedVideoPlayer.srcObject = null;

        this._updateRecordingDurationLabel();

        this._setState('initializing');
    }

    _startUploading() {
        try {
            this._question.uploader.upload(
                this._mediaCaptureManager.recordedDataBlob,
                this._recordingDurationInSeconds
            );
        } catch (error) {
            this._showError(error.message);
        }
    }

    _onUploadingStarted() {
        this._progressControl.start();
        this._;
        this._setState('uploading');
        this._recordedVideoPlayer.pause();
        this.pending = true;
    }

    _onUploadingProgress(value) {
        this._progressControl.progress(value);
    }

    _onUploadingCompleted({ mediaFileId, mediaFileUrl }) {
        this._question.setValue(mediaFileId, mediaFileUrl, Utils.formatDuration(this._recordingDurationInSeconds));
        this._mediaCaptureManager.reset();

        this.pending = false;
    }

    _cancelUploading() {
        try {
            this._question.uploader.cancel();
        } catch (error) {
            this._showError(error.message);
        }
    }

    _onlUploadingCanceled() {
        this._setState('recorded');

        this.pending = false;
    }

    _onUploadingError(errorMessage) {
        this._showError(errorMessage);
        this._setState('upload-error');

        this.pending = false;
    }

    _onError(error) {
        this._showError(error.message);
        this._setState('error');
    }

    _showError(errorDetails) {
        this._errorMessage.text(this._settings.messages.error);
        this._errorDetails.text(errorDetails);
    }

    async _onModelValueChange() {
        if (!this._question.value.videoId) {
            return;
        }

        this._updatePreview();

        this._node.addClass('cf-media-upload--uploaded');
    }

    _updatePreview() {
        this._uploadedVideoPlayer.src = this._question.value.previewUrl;
        this._uploadedVideoDurationLabel.text(this._question.value.duration);
    }

    /**
     * Start playing video
     */
    play() {
        this._node.addClass('cf-media-upload--playing');
        this._uploadedVideoPreview.addClass('cf-video-preview--playing');
        this._uploadedVideoPlayer.play();
    }

    _closeUploadedVideo() {
        this._uploadedVideoPlayer.pause();
        this._uploadedVideoPlayer.currentTime = 0;
        this._node.removeClass('cf-media-upload--playing');
        this._uploadedVideoPreview.removeClass('cf-video-preview--playing');
    }
}
