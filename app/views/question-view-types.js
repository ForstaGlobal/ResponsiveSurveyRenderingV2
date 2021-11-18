import QuestionViewBase from './questions/base/question-view-base';
import QuestionView from './questions/base/question-view.js';
import QuestionWithAnswersView from './questions/base/question-with-answers-view.js';
import RatingGridQuestionViewBase from './questions/base/rating-grid-question-view-base.js';
import SingleQuestionView, {SingleQuestionViewWithStoredOtherValues} from './questions/single-question-view.js';
import SliderSingleQuestionView from './questions/slider-single-question-view.js';
import SliderNumericQuestionView from './questions/slider-numeric-question-view.js';
import SliderGridQuestionView from './questions/slider-grid-question-view.js';
import MultiQuestionView, {MultiQuestionViewWithStoredOtherValues} from './questions/multi-question-view.js';
import CaptureOrderMultiQuestionView, {CaptureOrderMultiQuestionViewWithStoredOtherValues} from './questions/capture-order-multi-question-view';
import GridQuestionView from './questions/grid/grid-question-view.js';
import GridQuestionViewBase from './questions/grid/grid-question-view-base.js';
import MobileGridQuestionView from './questions/grid/mobile-grid-question-view.js';
import DesktopGridQuestionView from './questions/grid/desktop-grid-question-view.js';
import MultiGridQuestionView from './questions/multi-grid/multi-grid-question-view.js';
import MultiGridQuestionViewBase from './questions/multi-grid/multi-grid-question-view-base.js';
import DesktopMultiGridQuestionView from './questions/multi-grid/desktop-multi-grid-question-view.js';
import MobileMultiGridQuestionView from './questions/multi-grid/mobile-multi-grid-question-view.js';
import DesktopAnswerButtonsMultiGridQuestionView from './questions/multi-grid/desktop-answer-buttons-multi-grid-question-view.js';
import MobileAnswerButtonsMultiGridQuestionView from './questions/multi-grid/mobile-answer-buttons-multi-grid-question-view.js';
import OpenTextListQuestionView from './questions/open-text-list-question-view.js';
import OpenTextQuestionView from './questions/open-text-question-view.js';
import NumericQuestionView from './questions/numeric-question-view.js';
import NumericListQuestionView from './questions/numeric-list-question-view.js';
import DateQuestionView from './questions/date-question-view.js';
import DateQuestionPolyfillView from './questions/date-question-polyfill-view.js';
import EmailQuestionView from './questions/email-question-view';
import CodeCaptureQuestionView from './questions/code-capture-question-view';
import RankingQuestionView, {RankingQuestionViewWithStoredOtherValues} from './questions/ranking-question-view.js';
import HorizontalRatingSingleQuestionView from './questions/horizontal-rating-single-question-view.js';
import HorizontalRatingGridQuestionView from './questions/horizontal-rating-grid/horizontal-rating-grid-question-view.js';
import MobileHorizontalRatingGridQuestionView from './questions/horizontal-rating-grid/mobile-horizontal-rating-grid-question-view.js';
import DesktopHorizontalRatingGridQuestionView from './questions/horizontal-rating-grid/desktop-horizontal-rating-grid-question-view.js';
import GridBarsSingleQuestionView from './questions/grid-bars-single-question-view.js';
import GridBarsGridQuestionView from './questions/grid-bars-grid/grid-bars-grid-question-view.js';
import GridBarsGridQuestionViewBase from './questions/grid-bars-grid/grid-bars-grid-question-view-base.js';
import MobileGridBarsGridQuestionView from './questions/grid-bars-grid/mobile-grid-bars-grid-question-view.js';
import DesktopGridBarsGridQuestionView from './questions/grid-bars-grid/desktop-grid-bars-grid-question-view.js';
import StarRatingGridQuestionView from './questions/star-rating-grid/star-rating-grid-question-view.js';
import StarRatingGridQuestionViewBase from './questions/star-rating-grid/star-rating-grid-question-view-base.js';
import MobileStarRatingGridQuestionView from './questions/star-rating-grid/mobile-star-rating-grid-question-view.js';
import DesktopStarRatingGridQuestionView from './questions/star-rating-grid/desktop-star-rating-grid-question-view.js';
import StarRatingSingleQuestionView from './questions/star-rating-single-question-view.js';
import AccordionGridQuestionView from './questions/accordion-grid-question-view';
import CarouselGridQuestionView from './questions/carousel-grid-question-view.js';
import CarouselHorizontalRatingGridQuestionView from './questions/carousel-horizontal-rating-grid-question-view.js';
import CarouselGridBarsGridQuestionView from './questions/carousel-grid-bars-grid-question-view.js';
import CarouselStarRatingGridQuestionView from './questions/carousel-star-rating-grid-question-view.js';
import DropdownSingleQuestionView from './questions/dropdown-single-question-view.js';
import DropdownGridQuestionView from './questions/dropdown-grid-question-view.js';
import AnswerButtonsSingleQuestionView, {AnswerButtonsSingleQuestionViewWithStoredOtherValues} from './questions/answer-buttons-single-question-view.js';
import AnswerButtonsMultiQuestionView, {AnswerButtonsMultiQuestionViewWithStoredOtherValues} from './questions/answer-buttons-multi-question-view.js';
import AnswerButtonsCaptureOrderMultiQuestionView, {AnswerButtonsCaptureOrderMultiQuestionViewWithStoredOtherValues} from './questions/answer-buttons-capture-order-multi-question-view';
import GeolocationQuestionView from './questions/geolocation-question-view.js';
import ImageUploadQuestionView from './questions/image-upload-question-view.js';
import LoginPageQuestionView from './questions/login-page-question-view.js';
import MaxDiffQuestionView from './questions/max-diff/max-diff-question-view.js';
import DropdownHierarchyQuestionView from "./questions/dropdown-hierarchy-question-view";
import AudioUploadQuestionView from './questions/audio-upload-question-view';
import VideoUploadQuestionView from './questions/video-upload-question-view';

import Grid3DQuestionView from './questions/grid-3d-question-view';
import Grid3DDesktopQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-question-view';
import Grid3DDesktopInnerQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-question-view';
import Grid3DDesktopInnerSingleQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-single-question-view';
import Grid3DDesktopInnerSingleAnswerButtonsQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-single-answer-buttons-question-view';
import Grid3DDesktopInnerMultiQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-multi-question-view';
import Grid3DDesktopInnerMultiAnswerButtonsQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-multi-answer-buttons-question-view';
import Grid3DDesktopInnerRankByNumberQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-rank-by-number-view';
import Grid3DDesktopInnerOpenListQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-open-list-question-view';
import Grid3DDesktopInnerNumericListQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-numeric-list-question-view';
import Grid3DDesktopInnerGridQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-grid-question-view';
import Grid3DDesktopInnerSliderGridQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-slider-grid-question-view';
import Grid3DDesktopInnerDropdownGridQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-dropdown-grid-question-view';
import Grid3DDesktopInnerHorizontalRatingGridQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-horizontal-rating-grid-question-view';
import Grid3DDesktopInnerStarRatingGridQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-star-rating-grid-question-view';
import Grid3DDesktopInnerGridBarsGridQuestionView from './questions/grid-3d/desktop/grid-3d-desktop-inner-grid-bars-grid-question-view';
import Grid3DMobileQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-question-view';
import Grid3DMobileInnerQuestionViewMixin from './questions/grid-3d/mobile/grid-3d-mobile-inner-question-view-mixin';
import Grid3DMobileInnerSingleQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-inner-single-question-view';
import Grid3DMobileInnerSingleAnswerButtonsQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-inner-single-answer-buttons-question-view';
import Grid3DMobileInnerMultiQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-inner-multi-question-view';
import Grid3DMobileInnerMultiAnswerButtonsQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-inner-multi-answer-buttons-question-view';
import Grid3DMobileInnerOpenListQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-inner-open-list-question-view';
import Grid3DMobileInnerNumericListQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-inner-numeric-list-question-view';
import Grid3DMobileInnerRankByNumberQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-inner-rank-by-number-question-view';
import Grid3DMobileInnerGridQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-inner-grid-question-view';
import Grid3DMobileInnerSliderGridQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-inner-slider-grid-question-view';
import Grid3DMobileInnerDropdownGridQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-inner-dropdown-grid-question-view';
import Grid3DMobileInnerHorizontalRatingGridQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-inner-horizontal-rating-grid-question-view';
import Grid3DMobileInnerStarRatingGridQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-inner-star-rating-grid-question-view';
import Grid3DMobileInnerGridBarsGridQuestionView from './questions/grid-3d/mobile/grid-3d-mobile-inner-grid-bars-grid-question-view';



export default Object.freeze({
    'QuestionViewBase': QuestionViewBase,
    'QuestionView': QuestionView,
    'QuestionWithAnswersView': QuestionWithAnswersView,
    'RatingGridQuestionViewBase': RatingGridQuestionViewBase,
    'SingleQuestionView' : SingleQuestionView,
    'SingleQuestionViewWithStoredOtherValues': SingleQuestionViewWithStoredOtherValues,
    'SliderSingleQuestionView' : SliderSingleQuestionView,
    'SliderNumericQuestionView' : SliderNumericQuestionView,
    'SliderGridQuestionView' : SliderGridQuestionView,
    'MultiQuestionView': MultiQuestionView,
    'MultiQuestionViewWithStoredOtherValues': MultiQuestionViewWithStoredOtherValues,
    'CaptureOrderMultiQuestionView': CaptureOrderMultiQuestionView,
    'CaptureOrderMultiQuestionViewWithStoredOtherValues': CaptureOrderMultiQuestionViewWithStoredOtherValues,
    'GridQuestionView': GridQuestionView,
    'GridQuestionViewBase': GridQuestionViewBase,
    'MobileGridQuestionView': MobileGridQuestionView,
    'DesktopGridQuestionView': DesktopGridQuestionView,
    'MultiGridQuestionView': MultiGridQuestionView,
    'MultiGridQuestionViewBase': MultiGridQuestionViewBase,
    'DesktopMultiGridQuestionView': DesktopMultiGridQuestionView,
    'MobileMultiGridQuestionView': MobileMultiGridQuestionView,
    'DesktopAnswerButtonsMultiGridQuestionView': DesktopAnswerButtonsMultiGridQuestionView,
    'MobileAnswerButtonsMultiGridQuestionView': MobileAnswerButtonsMultiGridQuestionView,
    'OpenTextListQuestionView': OpenTextListQuestionView,
    'OpenTextQuestionView': OpenTextQuestionView,
    'NumericQuestionView': NumericQuestionView,
    'NumericListQuestionView': NumericListQuestionView,
    'DateQuestionView': DateQuestionView,
    'DateQuestionPolyfillView': DateQuestionPolyfillView,
    'EmailQuestionView': EmailQuestionView,
    'RankingQuestionView': RankingQuestionView,
    'RankingQuestionViewWithStoredOtherValues': RankingQuestionViewWithStoredOtherValues,
    'HorizontalRatingSingleQuestionView': HorizontalRatingSingleQuestionView,
    'HorizontalRatingGridQuestionView': HorizontalRatingGridQuestionView,
    'MobileHorizontalRatingGridQuestionView': MobileHorizontalRatingGridQuestionView,
    'DesktopHorizontalRatingGridQuestionView': DesktopHorizontalRatingGridQuestionView,
    'GridBarsSingleQuestionView': GridBarsSingleQuestionView,
    'GridBarsGridQuestionView': GridBarsGridQuestionView,
    'GridBarsGridQuestionViewBase': GridBarsGridQuestionViewBase,
    'MobileGridBarsGridQuestionView': MobileGridBarsGridQuestionView,
    'DesktopGridBarsGridQuestionView': DesktopGridBarsGridQuestionView,
    'StarRatingSingleQuestionView': StarRatingSingleQuestionView,
    'StarRatingGridQuestionView': StarRatingGridQuestionView,
    'StarRatingGridQuestionViewBase': StarRatingGridQuestionViewBase,
    'MobileStarRatingGridQuestionView': MobileStarRatingGridQuestionView,
    'DesktopStarRatingGridQuestionView': DesktopStarRatingGridQuestionView,
    'AccordionGridQuestionView' : AccordionGridQuestionView,
    'CarouselGridQuestionView': CarouselGridQuestionView,
    'CarouselHorizontalRatingGridQuestionView': CarouselHorizontalRatingGridQuestionView,
    'CarouselGridBarsGridQuestionView': CarouselGridBarsGridQuestionView,
    'CarouselStarRatingGridQuestionView': CarouselStarRatingGridQuestionView,
    'DropdownSingleQuestionView': DropdownSingleQuestionView,
    'DropdownGridQuestionView': DropdownGridQuestionView,
    'AnswerButtonsSingleQuestionView': AnswerButtonsSingleQuestionView,
    'AnswerButtonsSingleQuestionViewWithStoredOtherValues': AnswerButtonsSingleQuestionViewWithStoredOtherValues,
    'AnswerButtonsMultiQuestionView': AnswerButtonsMultiQuestionView,
    'AnswerButtonsMultiQuestionViewWithStoredOtherValues': AnswerButtonsMultiQuestionViewWithStoredOtherValues,
    'AnswerButtonsCaptureOrderMultiQuestionView': AnswerButtonsCaptureOrderMultiQuestionView,
    'AnswerButtonsCaptureOrderMultiQuestionViewWithStoredOtherValues': AnswerButtonsCaptureOrderMultiQuestionViewWithStoredOtherValues,
    'GeolocationQuestionView': GeolocationQuestionView,  // This ref used in mobile CAPI app overrides
    'ImageUploadQuestionView': ImageUploadQuestionView, // This ref used in mobile CAPI app overrides
    'VideoUploadQuestionView': VideoUploadQuestionView, // This ref used in mobile CAPI app overrides
    'AudioUploadQuestionView': AudioUploadQuestionView, // This ref used in mobile CAPI app overrides
    'CodeCaptureQuestionView': CodeCaptureQuestionView, // This ref used in mobile CAPI app overrides
    'LoginPageQuestionView': LoginPageQuestionView,
    'DropdownHierarchyQuestionView': DropdownHierarchyQuestionView,
    'MaxDiffQuestionView': MaxDiffQuestionView,

    'Grid3DQuestionView': Grid3DQuestionView,
    'Grid3DDesktopQuestionView': Grid3DDesktopQuestionView,
    'Grid3DDesktopInnerQuestionView': Grid3DDesktopInnerQuestionView,
    'Grid3DDesktopInnerSingleQuestionView': Grid3DDesktopInnerSingleQuestionView,
    'Grid3DDesktopInnerSingleAnswerButtonsQuestionView': Grid3DDesktopInnerSingleAnswerButtonsQuestionView,
    'Grid3DDesktopInnerMultiQuestionView': Grid3DDesktopInnerMultiQuestionView,
    'Grid3DDesktopInnerMultiAnswerButtonsQuestionView': Grid3DDesktopInnerMultiAnswerButtonsQuestionView,
    'Grid3DDesktopInnerRankByNumberQuestionView': Grid3DDesktopInnerRankByNumberQuestionView,
    'Grid3DDesktopInnerOpenListQuestionView': Grid3DDesktopInnerOpenListQuestionView,
    'Grid3DDesktopInnerNumericListQuestionView': Grid3DDesktopInnerNumericListQuestionView,
    'Grid3DDesktopInnerGridQuestionView': Grid3DDesktopInnerGridQuestionView,
    'Grid3DDesktopInnerDropdownGridQuestionView': Grid3DDesktopInnerDropdownGridQuestionView,
    'Grid3DDesktopInnerSliderGridQuestionView': Grid3DDesktopInnerSliderGridQuestionView,
    'Grid3DDesktopInnerHorizontalRatingGridQuestionView': Grid3DDesktopInnerHorizontalRatingGridQuestionView,
    'Grid3DDesktopInnerStarRatingGridQuestionView': Grid3DDesktopInnerStarRatingGridQuestionView,
    'Grid3DDesktopInnerGridBarsGridQuestionView': Grid3DDesktopInnerGridBarsGridQuestionView,
    'Grid3DMobileQuestionView': Grid3DMobileQuestionView,
    'Grid3DMobileInnerQuestionViewMixin': Grid3DMobileInnerQuestionViewMixin,
    'Grid3DMobileInnerSingleQuestionView': Grid3DMobileInnerSingleQuestionView,
    'Grid3DMobileInnerSingleAnswerButtonsQuestionView': Grid3DMobileInnerSingleAnswerButtonsQuestionView,
    'Grid3DMobileInnerMultiQuestionView': Grid3DMobileInnerMultiQuestionView,
    'Grid3DMobileInnerMultiAnswerButtonsQuestionView': Grid3DMobileInnerMultiAnswerButtonsQuestionView,
    'Grid3DMobileInnerOpenListQuestionView': Grid3DMobileInnerOpenListQuestionView,
    'Grid3DMobileInnerNumericListQuestionView': Grid3DMobileInnerNumericListQuestionView,
    'Grid3DMobileInnerRankByNumberQuestionView': Grid3DMobileInnerRankByNumberQuestionView,
    'Grid3DMobileInnerGridQuestionView': Grid3DMobileInnerGridQuestionView,
    'Grid3DMobileInnerDropdownGridQuestionView': Grid3DMobileInnerDropdownGridQuestionView,
    'Grid3DMobileInnerSliderGridQuestionView': Grid3DMobileInnerSliderGridQuestionView,
    'Grid3DMobileInnerHorizontalRatingGridQuestionView': Grid3DMobileInnerHorizontalRatingGridQuestionView,
    'Grid3DMobileInnerStarRatingGridQuestionView': Grid3DMobileInnerStarRatingGridQuestionView,
    'Grid3DMobileInnerGridBarsGridQuestionView': Grid3DMobileInnerGridBarsGridQuestionView,
});