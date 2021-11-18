import QuestionView from './base/question-view.js'

export default class GeolocationQuestionView extends QuestionView {
    constructor(question) {
        super(question);
        this._getCurrentPosition();
    }

    /* this method have to be implemented in view, due to native app override */
    _getCurrentPosition() {
        if (!window.navigator.geolocation) {
            return
        }

        window.navigator.geolocation.getCurrentPosition(
            this._setPosition.bind(this),
            null,
            { enableHighAccuracy: true }
        );
    }

    _setPosition(position) {
        this._question.setValue(position.coords.latitude, position.coords.longitude);        
    }
}
