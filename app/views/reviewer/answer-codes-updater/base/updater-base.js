import LayoutType from './layout-type';
import QuestionIdProvider from '../../../helpers/question-id-provider';
import MobileQuestionIdProvider from '../../../helpers/mobile-question-id-provider';
import DesktopQuestionIdProvider from '../../../helpers/desktop-question-id-provider';
import IUpdater from './updater-interface';

export default class UpdaterBase extends IUpdater {
    constructor(question) {
        super();
        this._question = question;
    }

    _renderAnswerCode(questionId, answerCode) {
        return `<span class="sr-answer-code-attribute">${answerCode}: </span>`;
    }

    _getIdProviderByLayout(layoutType = LayoutType.Regular) {
        switch (layoutType) {
            case LayoutType.Regular:
                return new QuestionIdProvider(this._question.id);
            case LayoutType.Mobile:
                return new MobileQuestionIdProvider(this._question.id);
            case LayoutType.Desktop:
                return new DesktopQuestionIdProvider(this._question.id);
        }
    }
}
