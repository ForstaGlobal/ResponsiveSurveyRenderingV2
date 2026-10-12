import CompositeUpdater from './base/composite-updater';
import CleanupUpdater from './base/cleanup-updater';
import OtherAnswersUpdater from './base/other-answers-updater';
import AnswersUpdater from './base/answers-updater';
import DropdownScalesUpdater from './base/dropdown-scales-updater';

export default class DropdownGridUpdater extends CompositeUpdater {
    constructor(question) {
        super([
            new CleanupUpdater(question),
            new AnswersUpdater(question),
            new OtherAnswersUpdater(question),
            new DropdownScalesUpdater(question),
        ]);
    }
}
