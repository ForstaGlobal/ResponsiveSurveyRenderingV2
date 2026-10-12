import VideoUploadQuestionViewBase from './video-upload-question-view-base';
import DesktopQuestionIdProvider from '../../helpers/desktop-question-id-provider';

export default class DesktopVideoUploadView extends VideoUploadQuestionViewBase {
    /**
     * @param {VideoUploadQuestion} question
     * @param {MediaCaptureManager} mediaCaptureManager
     * @param {QuestionViewSettings} settings
     */
    constructor(question, mediaCaptureManager, settings) {
        super(question, mediaCaptureManager, settings);

        this._baseSelector = 'cf-desktop-video-upload';

        this._init();
        this._attachHandlers();
    }

    _createIdProvider(questionId) {
        return new DesktopQuestionIdProvider(questionId);
    }

    _init() {
        super._init();

        this._deviceSettings = this._node.find(`.${this._baseSelector}__settings`);
        this._cameraDeviceList = this._deviceSettings.find(`.${this._baseSelector}__camera-list`);
        this._microphoneDeviceList = this._deviceSettings.find(`.${this._baseSelector}__microphone-list`);

        this._settingsButton = this._node.find(`.${this._baseSelector}__settings-button`);
        this._closeSettingsButton = this._node.find(`.${this._baseSelector}__close-settings-button`);
    }

    _attachHandlers() {
        super._attachHandlers();

        this._settingsButton.on('click', this._toggleDeviceSettingsDisplay.bind(this));
        this._closeSettingsButton.on('click', this._closeDeviceSettings.bind(this));

        this._mediaCaptureManager.mediaDevicesEnumeratedEvent.on(this._mediaDevicesEnumerated.bind(this));
    }

    _setState(state = null) {
        super._setState(state);

        if (state !== 'previewing') {
            this._deviceSettings.addClass(`${this._baseSelector}__settings--hidden`);
        }
    }

    _mediaDevicesEnumerated() {
        this._cameraDeviceList.html('');
        this._mediaCaptureManager.cameraList.forEach(cameraDevice => {
            this._renderCameraDeviceButton(cameraDevice);
        });

        this._microphoneDeviceList.html('');
        this._mediaCaptureManager.microphoneList.forEach(microphoneDevice => {
            this._renderMicrophoneDeviceButton(microphoneDevice);
        });

        if (this._mediaCaptureManager.selectedCamera) {
            this._selectCamera(this._mediaCaptureManager.selectedCamera);
        }

        if (this._mediaCaptureManager.selectedMicrophone) {
            this._selectMicrophone(this._mediaCaptureManager.selectedMicrophone);
        }
    }

    _renderCameraDeviceButton(cameraDevice) {
        this._cameraDeviceList.append(
            `<div id="${this._getCameraButtonId(cameraDevice.deviceId)}" class="${this._baseSelector}__device">
                <div class="${this._baseSelector}__device-selected-icon"></div>
                <span class="${this._baseSelector}__device-label">${cameraDevice.label}</span>
            </div>`
        );

        this._cameraDeviceList.find(`#${this._getCameraButtonId(cameraDevice.deviceId)}`).click(() => {
            this._onCameraDeviceButtonClick(cameraDevice);
        });
    }

    _getCameraButtonId(cameraDeviceId) {
        return `camera-${cameraDeviceId.replace(/[^a-zA-Z0-9]/gi, '')}`;
    }

    _onCameraDeviceButtonClick(cameraDevice) {
        if (
            this._mediaCaptureManager.selectedCamera &&
            this._mediaCaptureManager.selectedCamera.deviceId === cameraDevice.deviceId
        ) {
            return;
        }

        this._mediaCaptureManager.selectCamera(cameraDevice);
        this._mediaCaptureManager.startCapturing();
    }

    _selectCamera(cameraDevice) {
        this._cameraDeviceList.children().each((index, device) => {
            device.classList.remove(`${this._baseSelector}__device--selected`);
        });

        this._cameraDeviceList
            .find(`#${this._getCameraButtonId(cameraDevice.deviceId)}`)
            .addClass(`${this._baseSelector}__device--selected`);
    }

    _renderMicrophoneDeviceButton(microphoneDevice) {
        this._microphoneDeviceList.append(`
            <div id="${this._getMicrophoneButtonId(microphoneDevice.deviceId)}" class="${this._baseSelector}__device">
                <div class="${this._baseSelector}__device-selected-icon"></div>
                <span class="${this._baseSelector}__device-label">${microphoneDevice.label}</span>
            </div>`);

        this._microphoneDeviceList.find(`#${this._getMicrophoneButtonId(microphoneDevice.deviceId)}`).click(() => {
            this._onMicrophoneDeviceButtonClick(microphoneDevice);
        });
    }

    _onMicrophoneDeviceButtonClick(microphoneDevice) {
        if (
            this._mediaCaptureManager.selectedMicrophone &&
            this._mediaCaptureManager.selectedMicrophone.deviceId === microphoneDevice.deviceId
        ) {
            return;
        }

        this._mediaCaptureManager.selectMicrophone(microphoneDevice);
        this._mediaCaptureManager.startCapturing();
    }

    _getMicrophoneButtonId(microphoneDeviceId) {
        return `microphone-${microphoneDeviceId.replace(/[^a-zA-Z0-9]/gi, '')}`;
    }

    _selectMicrophone(microphoneDevice) {
        this._microphoneDeviceList.children().each((index, device) => {
            device.classList.remove(`${this._baseSelector}__device--selected`);
        });

        this._microphoneDeviceList
            .find(`#${this._getMicrophoneButtonId(microphoneDevice.deviceId)}`)
            .addClass(`${this._baseSelector}__device--selected`);
    }

    _onMediaDeviceSelectionChanged() {
        super._onMediaDeviceSelectionChanged();

        if (this._mediaCaptureManager.selectedCamera) {
            this._selectCamera(this._mediaCaptureManager.selectedCamera);
        }

        if (this._mediaCaptureManager.selectedMicrophone) {
            this._selectMicrophone(this._mediaCaptureManager.selectedMicrophone);
        }
    }

    _toggleDeviceSettingsDisplay() {
        this._deviceSettings.toggleClass(`${this._baseSelector}__settings--hidden`);
    }

    _closeDeviceSettings() {
        this._deviceSettings.addClass(`${this._baseSelector}__settings--hidden`);
    }
}
