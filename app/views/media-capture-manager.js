import Event from 'event';
import Utils from 'utils';

export default class MediaCaptureManager {
    constructor(defaultUserMediaConstraints, mimeTypes) {
        this._defaultUserMediaConstraints = defaultUserMediaConstraints;
        this._mimeType =
            typeof MediaRecorder === 'function' && MediaRecorder.isTypeSupported
                ? mimeTypes.find(mimeType => MediaRecorder.isTypeSupported(mimeType))
                : mimeTypes[0];

        this._cameraList = [];
        this._microphoneList = [];
        this._selectedCamera = null;
        this._selectedMicrophone = null;

        this._mediaRecorder = null;
        this._mediaStream = null;

        this._recordedData = [];
        this._recordedDataBlob = null;

        this._incrementRecordingDurationIfNeededInterval = null;
        this._recordingDurationInMilliseconds = 0;

        this._mediaDevicesEnumeratedEvent = new Event('media-capture-manager:media-devices-enumerated');
        this._mediaDeviceSelectionChangedEvent = new Event('media-capture-manager:media-device-selection-changed');
        this._capturingStartedEvent = new Event('media-capture-manager:capturing-started-event');
        this._preparingStartedEvent = new Event('media-capture-manager:preparing-started-event');
        this._recordingStartedEvent = new Event('media-capture-manager:recording-started-event');
        this._recordingDurationUpdatedEvent = new Event('media-capture-manager:recording-duration-updated-event');
        this._recordingPausedEvent = new Event('media-capture-manager:recording-paused-event');
        this._recordingResumedEvent = new Event('media-capture-manager:recording-resumed-event');
        this._recordedDataAvailableEvent = new Event('media-capture-manager:recorded-data-available-event');
        this._retakeEvent = new Event('media-capture-manager:retake-event');
        this._resetEvent = new Event('media-capture-manager:reset-event');
        this._errorEvent = new Event('media-capture-manager:error-event');
    }

    get cameraList() {
        return this._cameraList;
    }

    get microphoneList() {
        return this._microphoneList;
    }

    get selectedCamera() {
        return this._selectedCamera;
    }

    get selectedMicrophone() {
        return this._selectedMicrophone;
    }

    get mediaStream() {
        return this._mediaStream;
    }

    get recordedDataBlob() {
        return this._recordedDataBlob;
    }

    get mediaDevicesEnumeratedEvent() {
        return this._mediaDevicesEnumeratedEvent;
    }

    get mediaDeviceSelectionChangedEvent() {
        return this._mediaDeviceSelectionChangedEvent;
    }

    get capturingStartedEvent() {
        return this._capturingStartedEvent;
    }

    get preparingStartedEvent() {
        return this._preparingStartedEvent;
    }

    get recordingStartedEvent() {
        return this._recordingStartedEvent;
    }

    get recordingDurationUpdatedEvent() {
        return this._recordingDurationUpdatedEvent;
    }

    get recordingPausedEvent() {
        return this._recordingPausedEvent;
    }

    get recordingResumedEvent() {
        return this._recordingResumedEvent;
    }

    get recordedDataAvailableEvent() {
        return this._recordedDataAvailableEvent;
    }

    get retakeEvent() {
        return this._retakeEvent;
    }

    get resetEvent() {
        return this._resetEvent;
    }

    get errorEvent() {
        return this._errorEvent;
    }

    startCapturing() {
        if (!navigator.mediaDevices) {
            this._handleError(
                new Error(
                    'MediaDevices API is not supported by your browser or the page is not loaded over HTTPS protocol.'
                )
            );
            return;
        }

        this._startCapturing(this._getUserMediaConstraints(), true);
    }

    _getUserMediaConstraints() {
        const constraints = {
            ...this._defaultUserMediaConstraints,
        };

        if (constraints.video && this._selectedCamera && !Utils.isEmpty(this._selectedCamera.deviceId)) {
            constraints.video = {
                ...constraints.video,
                deviceId: this._selectedCamera.deviceId,
            };
        }

        if (constraints.audio && this._selectedMicrophone && !Utils.isEmpty(this._selectedMicrophone.deviceId)) {
            constraints.audio = {
                ...constraints.audio,
                deviceId: this._selectedMicrophone.deviceId,
            };
        }

        return constraints;
    }

    _startCapturing(userMediaConstraints, shouldTriggerEvents) {
        this.stopCapturing();

        return navigator.mediaDevices
            .getUserMedia(userMediaConstraints)
            .then(mediaStream => {
                this._mediaStream = mediaStream;

                if (shouldTriggerEvents) {
                    this._enumerateMediaDevices();
                    this._capturingStartedEvent.trigger(mediaStream);
                }
            })
            .catch(async error => {
                if (
                    (error.message === 'Requested device not found' ||
                        error.message === 'The object can not be found here.') &&
                    userMediaConstraints.audio !== false
                ) {
                    userMediaConstraints.audio = false;
                    this._startCapturing(userMediaConstraints);
                    return;
                }

                this._handleError(error);
            });
    }

    _enumerateMediaDevices() {
        if (!navigator.mediaDevices.enumerateDevices) {
            this._handleError(new Error('MediaDevices.enumerateDevices() function is not supported by your browser.'));
            return;
        }

        navigator.mediaDevices
            .enumerateDevices()
            .then(this._onMediaDevicesEnumerated.bind(this))
            .catch(this._handleError.bind(this));
    }

    _onMediaDevicesEnumerated(mediaDevices) {
        this._cameraList = [];
        this._microphoneList = [];

        mediaDevices.forEach(mediaDevice => {
            switch (mediaDevice.kind) {
                case 'videoinput':
                    this._cameraList.push(mediaDevice);
                    break;
                case 'audioinput':
                    this._microphoneList.push(mediaDevice);
                    break;
            }
        });

        if (this._cameraList.length > 0) {
            if (
                !this._selectedCamera ||
                !this._cameraList.find(camera => camera.deviceId === this._selectedCamera.deviceId)
            ) {
                const videoTracks = this._mediaStream.getVideoTracks();
                const currentVideoTrackCamera =
                    videoTracks.length > 0
                        ? this._cameraList.find(camera => camera.label === videoTracks[0].label)
                        : null;
                this._selectedCamera = currentVideoTrackCamera ?? this._cameraList[0];
            }
        } else {
            this._selectedCamera = null;
        }

        if (this._microphoneList.length > 0) {
            if (
                !this._selectedMicrophone ||
                !this._microphoneList.find(microphone => microphone.deviceId === this._selectedMicrophone.deviceId)
            ) {
                const audioTracks = this._mediaStream.getAudioTracks();
                const currentAudioTrackMicrophone =
                    audioTracks.length > 0
                        ? this._microphoneList.find(microphone => microphone.label === audioTracks[0].label)
                        : null;
                this._selectedMicrophone = currentAudioTrackMicrophone ?? this._microphoneList[0];
            }
        } else {
            this._selectedMicrophone = null;
        }

        this._mediaDevicesEnumeratedEvent.trigger();
    }

    selectCamera(cameraMediaDevice) {
        this._selectedCamera = cameraMediaDevice;
        this._mediaDeviceSelectionChangedEvent.trigger();
    }

    selectMicrophone(microphoneMediaDevice) {
        this._selectedMicrophone = microphoneMediaDevice;
        this._mediaDeviceSelectionChangedEvent.trigger();
    }

    prepare() {
        this._preparingStartedEvent.trigger();
    }

    async startRecording() {
        if (!this._mediaStream) {
            await this._startCapturing(this._getUserMediaConstraints(), false);
        }

        const mediaRecorderOptions = {
            mimeType: this._mimeType,
            videoBitsPerSecond: 1250000,
        };
        this._mediaRecorder = new MediaRecorder(this._mediaStream, mediaRecorderOptions);

        this._recordedData = [];
        this._recordedDataBlob = null;
        this._setRecordingDurationInMilliseconds(0);

        this._mediaRecorder.ondataavailable = event => {
            this._recordedData.push(event.data);
        };

        this._mediaRecorder.start();

        this._incrementRecordingDurationIfNeededInterval = setInterval(
            this._incrementRecordingDurationIfNeeded.bind(this),
            100
        );

        this._recordingStartedEvent.trigger();
    }

    pauseRecording() {
        if (!this._mediaRecorder || this._mediaRecorder.state !== 'recording') {
            return;
        }

        this._mediaRecorder.pause();
        this._recordingPausedEvent.trigger();
    }

    resumeRecording() {
        if (!this._mediaRecorder || this._mediaRecorder.state !== 'paused') {
            return;
        }

        this._mediaRecorder.resume();
        this._recordingResumedEvent.trigger();
    }

    stopRecording() {
        this._mediaRecorder.onstop = this._onRecordingStopped.bind(this);
        this.stopCapturing();
    }

    _onRecordingStopped() {
        this._recordedDataBlob = new Blob(this._recordedData, { type: this._mimeType });
        this._recordedDataAvailableEvent.trigger();
    }

    _incrementRecordingDurationIfNeeded() {
        if (this._mediaRecorder && this._mediaRecorder.state === 'recording') {
            this._setRecordingDurationInMilliseconds(this._recordingDurationInMilliseconds + 100);
        }
    }

    _setRecordingDurationInMilliseconds(value) {
        this._recordingDurationInMilliseconds = value;
        this._recordingDurationUpdatedEvent.trigger(value);
    }

    retake() {
        this._mediaRecorder = null;
        this._mediaStream = null;

        this._recordedData = [];
        this._recordedDataBlob = null;

        this._retakeEvent.trigger();

        this.startCapturing();
    }

    reset() {
        this.stopCapturing();

        this._cameraList = [];
        this._microphoneList = [];
        this._selectedCamera = null;
        this._selectedMicrophone = null;

        this._mediaRecorder = null;
        this._mediaStream = null;

        this._recordedData = [];
        this._recordedDataBlob = null;

        this._resetEvent.trigger();
    }

    stopCapturing() {
        if (
            this._mediaRecorder &&
            (this._mediaRecorder.state === 'recording' || this._mediaRecorder.state === 'paused')
        ) {
            this._mediaRecorder.stop();
        }

        if (this._mediaStream && this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {
            const mediaStreamTracks = this._mediaStream.getTracks();
            mediaStreamTracks.forEach(track => {
                track.stop();
            });
            mediaStreamTracks.forEach(track => {
                this._mediaStream.removeTrack(track);
            });
            this._mediaStream = null;
        }

        if (this._incrementRecordingDurationIfNeededInterval) {
            clearInterval(this._incrementRecordingDurationIfNeededInterval);
            this._incrementRecordingDurationIfNeededInterval = null;
            this._recordingDurationInMilliseconds = 0;
        }
    }

    _handleError(error) {
        this.stopCapturing();
        this._errorEvent.trigger(error);
    }
}
