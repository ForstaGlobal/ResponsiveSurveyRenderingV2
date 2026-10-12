import QuestionTypes from './question-types.js';
import SingleQuestion from './models/questions/single-question.js';
import MultiQuestion from './models/questions/multi-question.js';
import GridQuestion from './models/questions/grid-question.js';
import OpenTextListQuestion from './models/questions/open-text-list-question.js';
import OpenTextQuestion from './models/questions/open-text-question.js';
import NumericQuestion from './models/questions/numeric-question.js';
import NumericListQuestion from './models/questions/numeric-list-question.js';
import InfoQuestion from './models/questions/info-question.js';
import DateQuestion from './models/questions/date-question.js';
import EmailQuestion from './models/questions/email-question';
import AssistedOpenTextQuestion from './models/questions/assisted-open-text-question';
import OpenAssistService from './open-assist-service';
import RankingQuestion from './models/questions/ranking-question.js';
import SingleRatingQuestion from './models/questions/single-rating-question.js';
import GridRatingQuestion from './models/questions/grid-rating-question.js';
import Grid3DQuestion from './models/questions/grid-3d-question.js';
import GeolocationQuestion from './models/questions/geolocation-question.js';
import DynamicQuestionPlaceholder from './models/questions/dynamic-question-placeholder.js';
import ImageUploadQuestion from './models/questions/image-upload-question.js';
import FileUploadQuestion from './models/questions/file-upload-question';
import ImageUploader from './image-uploader';
import MediaUploader from './media-uploader';
import TestModeImageUploader from './test-mode-image-uploader';
import TestModeMediaUploader from './test-mode-media-uploader';
import LoginPageQuestion from './models/questions/login-page-question';
import TelephoneQuestion from './models/questions/telephone-question';
import HierarchyQuestion from './models/questions/hierarchy-question';
import HierarchyService from './hierarchy-service';
import Question from './models/base/question';
import VideoUploadQuestion from './models/questions/video-upload-question';
import AudioUploadQuestion from './models/questions/audio-upload-question';
import CodeCaptureQuestion from './models/questions/code-capture-question';
import SearchableSingleQuestion from './models/questions/searchable-single-question.js';
import SearchableMultiQuestion from './models/questions/searchable-multi-question.js';
import SearchableAnswerListService from './searchable-answer-list-service.js';
import ChartSingleQuestion from './models/questions/chart-single-question';
import ChartGridQuestion from './models/questions/chart-grid-question';
import MaxDiffQuestion from './models/questions/max-diff-question';
import Utils from '../utils';

export default class QuestionFactory {
    constructor(language, endpoints, isAccessible = true, isTest = false) {
        this._language = language;
        this._endpoints = endpoints;
        this._isAccessible = isAccessible;
        this._isTest = isTest;
    }

    create(rawModel) {
        const model = this._create(rawModel);

        if (this._isAccessible && model instanceof Question) {
            model.allowValidateOnChange = false;
        }

        return model;
    }

    _create(rawModel) {
        switch (rawModel.nodeType) {
            case QuestionTypes.Single:
                return new SingleQuestion(rawModel);
            case QuestionTypes.Multi:
                return new MultiQuestion(rawModel);
            case QuestionTypes.Grid:
                return new GridQuestion(rawModel);
            case QuestionTypes.OpenText:
                return new OpenTextQuestion(rawModel);
            case QuestionTypes.Numeric:
                return new NumericQuestion(rawModel);
            case QuestionTypes.OpenTextList:
                return new OpenTextListQuestion(rawModel);
            case QuestionTypes.NumericList:
                return new NumericListQuestion(rawModel);
            case QuestionTypes.Info:
                return new InfoQuestion(rawModel);
            case QuestionTypes.Date:
                return new DateQuestion(rawModel);
            case QuestionTypes.EmailOpen:
                return new EmailQuestion(rawModel);
            case QuestionTypes.AssistedOpen:
                return new AssistedOpenTextQuestion(
                    rawModel,
                    new OpenAssistService(this._endpoints.openAssistEndpoint)
                );
            case QuestionTypes.Ranking:
                return new RankingQuestion(rawModel);
            case QuestionTypes.HorizontalRatingScaleSingle:
            case QuestionTypes.GridBarsSingle:
            case QuestionTypes.StarRatingSingle:
                return new SingleRatingQuestion(rawModel);
            case QuestionTypes.HorizontalRatingScale:
            case QuestionTypes.GridBars:
            case QuestionTypes.StarRating:
                return new GridRatingQuestion(rawModel);
            case QuestionTypes.Grid3d:
                return new Grid3DQuestion(rawModel, this);
            case QuestionTypes.GeoLocation:
                return new GeolocationQuestion(rawModel);
            case QuestionTypes.DynamicQuestionPlaceholder:
                return new DynamicQuestionPlaceholder(rawModel);
            case QuestionTypes.ImageUploader:
                return new ImageUploadQuestion(
                    rawModel,
                    this._createImageUploader(this._endpoints.imageUploadEndpoint)
                );
            case QuestionTypes.VideoCapture:
                return new VideoUploadQuestion(
                    rawModel,
                    this._createMediaUploader(this._endpoints.videoUploadEndpoint)
                );
            case QuestionTypes.AudioCapture:
                return new AudioUploadQuestion(
                    rawModel,
                    this._createMediaUploader(this._endpoints.audioUploadEndpoint)
                );
            case QuestionTypes.FileUpload:
                return new FileUploadQuestion(rawModel, this._createMediaUploader(this._endpoints.fileUploadEndpoint));
            case QuestionTypes.CodeCapture:
                return new CodeCaptureQuestion(rawModel);
            case QuestionTypes.Login:
                return new LoginPageQuestion(rawModel);
            case QuestionTypes.Telephone:
                return new TelephoneQuestion(rawModel);
            case QuestionTypes.Hierarchy:
                return new HierarchyQuestion(
                    rawModel,
                    new HierarchyService(this._endpoints.hierarchyApiEndpoint, this._language)
                );
            case QuestionTypes.SearchableSingle:
                return new SearchableSingleQuestion(rawModel, this._createSearchableAnswerListService());
            case QuestionTypes.SearchableMulti:
                return new SearchableMultiQuestion(rawModel, this._createSearchableAnswerListService());
            case QuestionTypes.ChartSingle:
                return new ChartSingleQuestion(rawModel);
            case QuestionTypes.ChartGrid:
                return new ChartGridQuestion(rawModel);
            case QuestionTypes.MaxDiff:
                return new MaxDiffQuestion(rawModel);
            default:
                return;
        }
    }

    _createImageUploader(endpoint) {
        if (this._isTest || Utils.isEmpty(endpoint)) {
            return new TestModeImageUploader();
        }

        return new ImageUploader(endpoint);
    }

    _createMediaUploader(endpoint) {
        if (this._isTest || Utils.isEmpty(endpoint)) {
            return new TestModeMediaUploader();
        }

        return new MediaUploader(endpoint);
    }

    _createSearchableAnswerListService() {
        return new SearchableAnswerListService(this._endpoints.searchableAnswerListEndpoint, this._language);
    }
}
