import $ from 'jquery';
import CompositeQuestionView from 'views/questions/base/composite-question-view';
import MediaCaptureManager from 'views/media-capture-manager';
import DesktopVideoUploadQuestionView from './desktop-video-upload-question-view';
import MobileVideoUploadQuestionView from './mobile-video-upload-question-view';
import Utils from '../../../utils';
import DesktopQuestionIdProvider from '../../helpers/desktop-question-id-provider';
import MobileQuestionIdProvider from '../../helpers/mobile-question-id-provider';

export default class VideoUploadQuestionView extends CompositeQuestionView {
    /**
     * @param {VideoUploadQuestion} question
     * @param {QuestionViewSettings} settings
     * @param {MediaCaptureManager} mediaCaptureManager
     */
    constructor(
        question,
        settings,
        mediaCaptureManager = new MediaCaptureManager(
            {
                video: {
                    width: { ideal: 1280, max: 1280 },
                    height: { ideal: 720, max: 720 },
                },
                audio: true,
            },
            ['video/mp4', 'video/webm']
        )
    ) {
        super(
            question,
            [
                new DesktopVideoUploadQuestionView(question, mediaCaptureManager, settings),
                new MobileVideoUploadQuestionView(question, mediaCaptureManager, settings),
            ],
            settings
        );

        this._mediaCaptureManager = mediaCaptureManager;

        this._node = this._container.find('.cf-media-upload');

        const desktopContainer = $(`#${new DesktopQuestionIdProvider(question.id).getQuestionContentNodeId()}`);
        const mobileContainer = $(`#${new MobileQuestionIdProvider(question.id).getQuestionContentNodeId()}`);

        const desktopUploadButton = desktopContainer.find('.cf-media-upload__upload-button');
        desktopUploadButton.on('click', this._upload.bind(this));

        const mobileUploadButton = mobileContainer.find('.cf-media-upload__upload-button');
        mobileUploadButton.on('click', this._upload.bind(this));

        const desktopQuestionView = this._questionViews.find(
            questionView => questionView instanceof DesktopVideoUploadQuestionView
        );
        const mobileQuestionView = this._questionViews.find(
            questionView => questionView instanceof MobileVideoUploadQuestionView
        );

        const desktopPlayUploadedVideoButton = desktopContainer.find('.cf-video-preview__icon');
        desktopPlayUploadedVideoButton.on('click', () => {
            this._play(desktopQuestionView);
        });

        const mobilePlayUploadedVideoButton = mobileContainer.find('.cf-video-preview__icon');
        mobilePlayUploadedVideoButton.on('click', () => {
            this._play(mobileQuestionView);
        });
    }

    /*
        DO NOT remove or change the method
        it is overridden in mobile apps (native camera experience is used instead)
    */
    _upload() {
        if (!Utils.isEmpty(this._question.value.previewUrl)) {
            if (!confirm(this._settings.messages.retakeVideo)) {
                return;
            }
            this._question.setValue('', '', '');
        }

        this._questionViews.forEach(questionView => {
            questionView.openRecording();
        });

        this._mediaCaptureManager.startCapturing();
    }

    /*
        DO NOT remove or change the method
        it is overridden in mobile apps (native camera experience is used instead)
    */
    _play(questionView = null) {
        if (questionView) {
            questionView.play();
        }
    }
}
