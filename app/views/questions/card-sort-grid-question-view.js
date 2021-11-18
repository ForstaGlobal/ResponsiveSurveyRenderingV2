import QuestionWithAnswersView from './base/question-with-answers-view';
import $ from 'jquery';

export default class CardSortGridQuestionView extends QuestionWithAnswersView {
    constructor(question, settings) {
        super(question, settings);
        this._isRanking = this._question.ranking;

        this._draggingAnswer = null;
        this._draggingAnswerNodeOffset = null;

        this._activeDropZone = null;
        this._originDropZone = null;
        this._dropZones = [];

        this._autoScroll = false;

        this._selectedAnswerClass = 'cf-card-sort-answer--selected';
        this._dropZoneActiveClass = 'cf-card-sort-drop-zone--active';
        this._dropZoneErrorClass = 'cf-card-sort-drop-zone--error';
        this._nonSelectedItemsList = this._container.find(
            '.cf-card-sort-answer-list--non-selected .cf-card-sort-answer-list__items'
        );
        this._nonSelectedListCounter = this._container.find(
            '.cf-card-sort-answer-list--non-selected .cf-card-sort-answer-list__counter'
        );

        this._init();
    }

    _init() {
        this._dropZones = [
            {
                scaleCode: null,
                node: this._container.find('.cf-card-sort-drop-zone--non-selected'),
                coordinates: {},
            },
            ...this._question.scales.map((scale) => {
                const node = this._getScaleNode(scale.code);
                return { scaleCode: scale.code, node, coordinates: {} };
            }),
        ];

        this._attachHandlersToDOM();
    }

    _attachHandlersToDOM() {
        this.answers
            .filter((answer) => answer.isOther)
            .forEach((answer) =>
                this._getAnswerOtherNode(answer.code)
                    .on('input', (e) => this._onAnswerOtherNodeValueChange(answer, e.target.value))
                    .on('mousedown', (e) => e.stopPropagation())
                    .on('touchstart', (e) => e.stopPropagation())
            );

        //mouse
        this._onAnswerMouseDown = this._onAnswerMouseDown.bind(this);
        this._onDocumentMouseMove = this._onDocumentMouseMove.bind(this);
        this._onDocumentMouseUp = this._onDocumentMouseUp.bind(this);

        this.answers.forEach((answer) =>
            this._getAnswerNode(answer.code).on('mousedown', (event) => this._onAnswerMouseDown(event, answer))
        );
        $(window).on('mousemove', this._onDocumentMouseMove);
        $(window).on('mouseup', this._onDocumentMouseUp);

        //touch
        this._onAnswerTouchStart = this._onAnswerTouchStart.bind(this);
        this._onDocumentTouchMove = this._onDocumentTouchMove.bind(this);
        this._onDocumentTouchEnd = this._onDocumentTouchEnd.bind(this);

        this.answers.forEach((answer) =>
            this._getAnswerNode(answer.code).on('touchstart', (event) => this._onAnswerTouchStart(event, answer))
        );
        $(window).on('touchmove', this._onDocumentTouchMove);
        $(window).on('touchend', this._onDocumentTouchEnd);

        this._container.on('touchstart', () => {});
    }

    detach() {
        super.detachModelHandlers();

        this._question.answers.forEach((answer) => {
            this._getAnswerNode(answer.code)
                .off('mousedown', this._onAnswerMouseDown)
                .off('touchstart', this._onAnswerTouchStart);
        });

        $(window)
            .off('mousemove', this._onDocumentMouseMove)
            .off('mouseup', this._onDocumentMouseUp)
            .off('touchmove', this._onDocumentTouchMove)
            .off('touchend', this._onDocumentTouchEnd);
    }

    _getScaleNodeId(scaleCode) {
        return `${this._question.id}_scale_${scaleCode}`;
    }

    _getScaleTextNodeId(scaleCode) {
        return `${this._getScaleNodeId(scaleCode)}_text`;
    }

    _getDraggingAnswerNode() {
        return this._draggingAnswer !== null ? this._getAnswerNode(this._draggingAnswer.code) : $([]);
    }

    _getMouseEventPointerPosition(event) {
        return { x: event.pageX, y: event.pageY };
    }

    _getTouchEventPointerPosition(event) {
        return { x: event.changedTouches[0].pageX, y: event.changedTouches[0].pageY };
    }

    _getScreenPointerPosition(pointerPosition) {
        return {
            x: pointerPosition.x - window.pageXOffset,
            y: pointerPosition.y - window.pageYOffset,
        };
    }

    _getNodeCoordinates(node) {
        const { left, top } = node.offset();
        const right = left + Math.round(node.outerWidth());
        const bottom = top + Math.round(node.outerHeight());
        return { left, top, right, bottom };
    }

    _getDropZoneByPointerPosition({ x, y }) {
        return (
            this._dropZones.find(
                ({ coordinates: { left, top, right, bottom } }) => x > left && x < right && y > top && y < bottom
            ) || null
        );
    }

    _isSelected(answerCode) {
        return this._question.values[answerCode] !== undefined;
    }

    _showAnswerErrors(validationResult) {
        let lastNonSelectedResult = null;
        validationResult.answerValidationResults
            .filter((result) => !result.isValid)
            .forEach((result) => {
                if (this._isSelected(result.answerCode)) {
                    this._showAnswerError(result);
                    return;
                }

                lastNonSelectedResult = result;
            });

        if (lastNonSelectedResult !== null) {
            const node = this._getAnswerNode(lastNonSelectedResult.answerCode);
            if (!node.is(':visible')) {
                this._nonSelectedItemsList.prepend(node);
            }
            this._showAnswerError(lastNonSelectedResult);
            this._nonSelectedListCounter.addClass('cf-card-sort-answer-list__counter--error');
        }
    }

    _showAnswerError(validationResult) {
        const answerNode = this._getAnswerNode(validationResult.answerCode);
        const target = answerNode.parent();
        const errorBlockId = this._getAnswerErrorBlockId(validationResult.answerCode);
        const errors = validationResult.errors.map((error) => error.message);
        this._answerErrorBlockManager.showErrors(errorBlockId, target, errors);
    }

    _hideErrors() {
        super._hideErrors();
        this._nonSelectedListCounter.removeClass('cf-card-sort-answer-list__counter--error');
    }

    _syncAnswerNodes({ values }) {
        if (!values) {
            return;
        }

        values.forEach((answerCode) => {
            const answerNode = this._getAnswerNode(answerCode);
            if (this._isSelected(answerCode)) {
                const scaleNode = this._getScaleNode(this._question.values[answerCode]);
                if (scaleNode.has(answerNode).length === 0) {
                    answerNode.addClass(this._selectedAnswerClass);
                    scaleNode.find('.cf-card-sort-answer-list__items').append(answerNode);
                }
            } else if (this._nonSelectedItemsList.has(answerNode).length === 0) {
                answerNode.removeClass(this._selectedAnswerClass);
                this._nonSelectedItemsList.prepend(answerNode);
            }
        });
    }

    _updateSelectedListCounters(values, previousValues) {
        const changedScaleCodes = [
            ...values
                .filter((answerCode) => previousValues[answerCode])
                .map((answerCode) => previousValues[answerCode]),
            ...values.map((answerCode) => this._question.values[answerCode]),
        ];

        changedScaleCodes.forEach((scaleCode) => {
            this._getScaleNode(scaleCode)
                .find('.cf-card-sort-answer-list__counter')
                .text(this._getSelectedAnswersCountInScale(scaleCode));
        });
    }

    _updateNonSelectedListCounters() {
        this._nonSelectedListCounter
            .children('span')
            .html(this.answers.length - Object.keys(this._question.values).length);
    }

    _updateDropZoneNodesOnModelChange({ values }) {
        if (!values) {
            return;
        }

        if (this._isRanking) {
            this._updateDropZonesErrorState(this._dropZones);
        }
    }

    _updateDropZonesErrorState(dropZones, onMove = false) {
        dropZones
            .filter((dropZone) => dropZone.scaleCode !== null)
            .forEach((dropZone) => {
                let dropZoneAnswersCount = this._getSelectedAnswersCountInScale(dropZone.scaleCode);
                if (onMove) {
                    if (dropZone === this._activeDropZone) {
                        dropZoneAnswersCount++;
                    }
                    if (dropZone === this._originDropZone) {
                        dropZoneAnswersCount--;
                    }
                }
                dropZone.node.toggleClass(this._dropZoneErrorClass, dropZoneAnswersCount > 1);
            });
    }

    _createPlaceholderNode() {
        const draggingNode = this._getDraggingAnswerNode();
        draggingNode.after(
            `<div class="cf-card-sort-answer-list__item cf-card-sort-answer-list__item--placeholder" style="height:${
                draggingNode.outerHeight() + 'px'
            }"></div>`
        );
    }

    _removePlaceholderNode() {
        this._container.find('.cf-card-sort-answer-list__item--placeholder').remove();
    }

    _updateDraggingAnswerOffset(pointerPosition) {
        const { x, y } = this._getScreenPointerPosition(pointerPosition);
        const { left, top } = this._getDraggingAnswerNode()[0].getBoundingClientRect();

        this._draggingAnswerNodeOffset = {
            x: x - left,
            y: y - top,
        };
    }

    _updateDropZonesCoordinates() {
        this._dropZones.forEach((dropZone) => {
            dropZone.coordinates = this._getNodeCoordinates(dropZone.node);
        });
    }

    _setActiveDropZone(newDropZone) {
        if (this._activeDropZone === newDropZone) {
            return;
        }

        if (this._activeDropZone !== null) {
            this._activeDropZone.node.removeClass(this._dropZoneActiveClass);
        }

        this._activeDropZone = newDropZone;

        if (this._activeDropZone !== null) {
            this._activeDropZone.node.addClass(this._dropZoneActiveClass);
        }
    }

    _freezeDropZoneHeight(dropZone) {
        dropZone.node.css('height', dropZone.node.outerHeight());
    }

    _unfreezeDropZoneHeight(dropZone) {
        dropZone.node.css('height', '');
    }

    _getSelectedAnswersCountInScale(scaleCode) {
        return Object.values(this._question.values).filter((value) => value === scaleCode).length;
    }

    _selectAnswer(answerCode, scaleCode) {
        this._question.setValue(answerCode, scaleCode);
    }

    _moveAnswerNode(pointerPosition) {
        const { x, y } = this._getScreenPointerPosition(pointerPosition);
        this._getDraggingAnswerNode().css(
            'transform',
            `translate3d(${x - this._draggingAnswerNodeOffset.x}px, ${y - this._draggingAnswerNodeOffset.y}px, 0)`
        );
    }

    _handleAutoScrollOnPointerMove(screenPositionY) {
        if (screenPositionY < 50) {
            this._autoScroll = true;
            this._scroll(-1);
            return;
        }

        if (screenPositionY > $(window).height() - 50) {
            this._autoScroll = true;
            this._scroll(1);
            return;
        }

        this._autoScroll = false;
    }

    _scroll(step) {
        if (!this._autoScroll) {
            return;
        }

        $(window).scrollTop($(window).scrollTop() + step);

        setTimeout(() => {
            this._scroll(step);
        }, 50);
    }

    _updateCounterNodes({ values }, { values: previousValues }) {
        if (!values) {
            return;
        }

        if (!this._isRanking) {
            this._updateSelectedListCounters(values, previousValues);
        }
        this._updateNonSelectedListCounters();
    }

    _onModelValueChange({ changes, previousState }) {
        this._updateAnswerOtherNodes(changes);
        this._syncAnswerNodes(changes);
        this._updateCounterNodes(changes, previousState);
        this._updateDropZoneNodesOnModelChange(changes);
    }

    _onAnswerMouseDown(event, answer) {
        if (event.which !== 1) {
            return;
        }

        event.stopPropagation();
        const position = this._getMouseEventPointerPosition(event);

        this._onAnswerMoveStart(answer, position);
    }

    _onDocumentMouseMove(event) {
        if (this._draggingAnswer === null) {
            return;
        }

        event.preventDefault();
        this._handleAutoScrollOnPointerMove(event.clientY);

        const position = this._getMouseEventPointerPosition(event);
        this._onAnswerMove(position);
    }

    _onDocumentMouseUp(event) {
        if (this._draggingAnswer === null) {
            return;
        }

        const pointer = this._getMouseEventPointerPosition(event);

        // disable auto scroll
        this._autoScroll = false;

        this._onAnswerMoveEnd(pointer);
    }

    _onAnswerTouchStart(event, answer) {
        if (this._draggingAnswer) {
            return true;
        }

        if (event.cancelable) {
            event.stopPropagation();
            event.preventDefault();
        }

        const pointer = this._getTouchEventPointerPosition(event);

        this._onAnswerMoveStart(answer, pointer);
    }

    _onDocumentTouchMove(event) {
        if (!this._draggingAnswer) {
            return;
        }

        this._handleAutoScrollOnPointerMove(event.changedTouches[0].clientY);

        const pointer = this._getTouchEventPointerPosition(event);
        this._onAnswerMove(pointer);
    }

    _onDocumentTouchEnd(event) {
        if (!this._draggingAnswer) {
            return;
        }

        if (event.cancelable) {
            event.stopPropagation();
            event.preventDefault();
        }

        const pointer = this._getTouchEventPointerPosition(event);
        // disable auto scroll
        this._autoScroll = false;

        this._onAnswerMoveEnd(pointer);
    }

    _onAnswerMoveStart(answer, pointerPosition) {
        this._updateDropZonesCoordinates();
        this._originDropZone = this._getDropZoneByPointerPosition(pointerPosition);
        this._setActiveDropZone(this._originDropZone);

        this._freezeDropZoneHeight(this._originDropZone);

        this._draggingAnswer = answer;
        this._updateDraggingAnswerOffset(pointerPosition);
        const draggingNode = this._getDraggingAnswerNode();
        draggingNode
            .css({ height: `${draggingNode.outerHeight()}px`, width: `${draggingNode.outerWidth()}px` })
            .addClass('cf-card-sort-answer--dragging');

        this._createPlaceholderNode();
        this._moveAnswerNode(pointerPosition);

        this._unfreezeDropZoneHeight(this._originDropZone);
    }

    _onAnswerMove(pointerPosition) {
        this._moveAnswerNode(pointerPosition);

        const activeDropZoneBeforeUpdate = this._activeDropZone;
        this._setActiveDropZone(this._getDropZoneByPointerPosition(pointerPosition));
        const activeDropZoneAfterUpdate = this._activeDropZone;

        if (this._isRanking && activeDropZoneBeforeUpdate !== activeDropZoneAfterUpdate) {
            const dropZones = [activeDropZoneBeforeUpdate, activeDropZoneAfterUpdate].filter(
                (dropZone) => dropZone !== null
            );
            this._updateDropZonesErrorState(dropZones, true);
        }
    }

    _onAnswerMoveEnd() {
        this._removePlaceholderNode();

        this._getDraggingAnswerNode()
            .removeClass('cf-card-sort-answer--dragging')
            .css({ transform: '', height: '', width: '' });

        let scaleCode = null;
        if (this._activeDropZone !== null) {
            if (this._isRanking && this._getSelectedAnswersCountInScale(this._activeDropZone.scaleCode) > 0) {
                scaleCode = this._originDropZone.scaleCode;
                this._updateDropZonesErrorState([this._originDropZone, this._activeDropZone]);
            } else {
                scaleCode = this._activeDropZone.scaleCode;
            }
        }
        this._selectAnswer(this._draggingAnswer.code, scaleCode);
        this._setActiveDropZone(null);

        this._originDropZone = null;
        this._draggingAnswer = null;
    }

    _onAnswerOtherNodeValueChange(answer, value) {
        this._question.setOtherValue(answer.code, value);
    }
}
