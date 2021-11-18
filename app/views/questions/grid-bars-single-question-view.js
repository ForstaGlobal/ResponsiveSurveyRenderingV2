import HorizontalRatingSingleQuestionView from './horizontal-rating-single-question-view';
import Utils from '../../utils';

export default class GridBarsSingleQuestionView extends HorizontalRatingSingleQuestionView {
    /**
     * @param {SingleQuestion} question
     * @param {QuestionViewSettings} settings
     */
    constructor(question, settings) {
        super(question, settings);

        this._groupNode = this._container.find('.cf-gb-single');
    }

    _attachHandlersToDOM() {
        super._attachHandlersToDOM();

        const attachHoverHandler = (answerCode) => {
            const item = this._getAnswerNode(answerCode);
            item.on('mouseover', mouseOver.bind(this, answerCode));
            item.on('mouseout', mouseOut.bind(this, answerCode));
        };

        const mouseOver = (answerCode) => {
            if (this._question.value && this._isItemInScale(this._question.value))
                return;

            this._clearHoverItemStyles(answerCode);
            this._setHoverItemStyles(answerCode);
        };

        const mouseOut = (answerCode) => {
            if (this._question.value && this._isItemInScale(this._question.value))
                return;

            this._clearHoverItemStyles(answerCode);
        };

        this._question.scaleItems.forEach(item => attachHoverHandler(item.code));
    }

    _updateAnswerNodes() {
        this._clearItemStyles();
        this._question.answers.forEach(answer => {
            this._getAnswerControlNode(answer.code)
                .attr('aria-checked', 'false')
                .attr('tabindex', '-1');
        });

        if (this._question.value === null) {
            this._getAnswerControlNode(this.answers[0].code)
                .attr('tabindex', '0');
            return;
        }

        this._setActiveItemStyles(this._question.value);
        this._getAnswerControlNode(this._question.value)
            .attr('aria-checked', 'true')
            .attr('tabindex', '0');
    }

    _setHoverItemStyles(answerCode) {
        if (this._isItemInScale(answerCode)) {
            this._setBarItemStyles(answerCode, 'cf-grid-bars-item--hover', 'cf-grid-bars-scale-texts-panel__item--hover');
        }
    }

    _setBarItemStyles(answerCode, itemStyle, textStyle) {
        this._question.scaleItems.some((scale, scaleIndex) => {
            const controlNode = this._getAnswerControlNode(scale.code);
            controlNode.addClass(itemStyle);
            if (!Utils.isEmpty(scale.backgroundColor)) {
                controlNode
                    .css('background-color', scale.backgroundColor)
                    .css('border-color', scale.backgroundColor);
            } else {
                controlNode
                    .css('opacity', (scaleIndex + 2) / (this._question.scaleItems.length + 1));
            }
            this._getAnswerTextNode(scale.code).addClass(textStyle);
            return scale.code === answerCode;
        });
    }

    _setNaItemStyles(answerCode) {
        const answer = this._question.getAnswer(answerCode);
        const controlNode = this._getAnswerControlNode(answerCode);
        this._getAnswerNode(answer.code).addClass('cf-radio-answer--selected');
        controlNode.addClass('cf-radio--selected');

        if (!Utils.isEmpty(answer.backgroundColor)) {
            controlNode
                .css('background-color', answer.backgroundColor)
                .css('border-color', answer.backgroundColor);
        }
    }

    _setActiveItemStyles(answerCode) {
        if (this._isItemInScale(answerCode)) {
            this._setBarItemStyles(answerCode, 'cf-grid-bars-item--selected', 'cf-grid-bars-scale-texts-panel__item--selected');
        } else {
            this._setNaItemStyles(answerCode);
        }
    }

    _clearItemStyles() {
        this._container.find('.cf-grid-bars-item')
            .removeClass('cf-grid-bars-item--selected')
            .removeClass('cf-grid-bars-item--hover')
            .css('opacity', '')
            .css('background-color', '')
            .css('border-color', '');

        this._container.find('.cf-radio-answer')
            .removeClass('cf-radio-answer--selected');
        this._container.find('.cf-radio')
            .removeClass('cf-radio--selected')
            .css('background-color', '')
            .css('border-color', '');

        this._container.find('.cf-grid-bars-scale-texts-panel__item')
            .removeClass('cf-grid-bars-scale-texts-panel__item--selected')
            .removeClass('cf-grid-bars-scale-texts-panel__item--hover');
    }

    _clearHoverItemStyles() {
        this._container.find('.cf-grid-bars-item')
            .removeClass('cf-grid-bars-item--hover')
            .css('opacity', '')
            .css('background-color', '')
            .css('border-color', '');

        this._container.find('.cf-grid-bars-scale-texts-panel__item')
            .removeClass('cf-grid-bars-scale-texts-panel__item--hover');
    }
}