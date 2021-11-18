import Utils from '../../utils';

export default class MultiCountHelper {
    static isMultiCountSet(multiCount) {
        return multiCount && (multiCount.equal || multiCount.min || multiCount.max);
    }

    static isMaxMultiCountReached(selectedAnswerCount, multiCount) {
        const { equal, max } = multiCount;

        return (
            (!Utils.isEmpty(equal) && selectedAnswerCount >= equal) ||
            (!Utils.isEmpty(max) && selectedAnswerCount >= max)
        );
    }
}
