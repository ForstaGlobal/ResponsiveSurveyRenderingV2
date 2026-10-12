import Event from 'event.js';

export default class UploadProgress {
    constructor(container) {
        this._value = 0;

        this._cancelEvent = new Event('upload-progress:cancel');
        this._container = container;
        this._progressNode = container.find('.circular-progress__progress');
        this._container.on('click', this._onClick.bind(this));
        this._circumference = 2 * Math.PI * parseInt(this._progressNode.attr('r'));

        this._canceled = null;
    }

    get cancelEvent() {
        return this._cancelEvent;
    }

    get canceled() {
        return this._canceled;
    }

    start() {
        this._value = 1;
        this._canceled = null;
        this._progressNode.attr('stroke-dashoffset', this._calculateDashOffset());
        this._progressNode.attr('stroke-dasharray', this._circumference);
    }

    progress(value) {
        this._value = value;
        this._progressNode.attr('stroke-dashoffset', this._calculateDashOffset());
    }

    finish() {
        this._value = 100;
        this._progressNode.attr('stroke-dashoffset', this._calculateDashOffset());
    }

    _calculateDashOffset() {
        return Math.round((this._circumference * (100 - this._value)) / 100);
    }

    _onClick() {
        this._value = 0;
        this._progressNode.attr('stroke-dashoffset', this._calculateDashOffset());
        this._canceled = true;
        this._cancelEvent.trigger();
    }
}
