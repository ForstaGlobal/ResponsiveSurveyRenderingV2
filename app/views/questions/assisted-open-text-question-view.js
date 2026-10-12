import { AssistedOpenMessageTypes } from 'api/models/questions/assisted-open-text-question';
import OpenTextQuestionView from './open-text-question-view';
import Utils from '../../utils';

export default class AssistedOpenTextQuestionView extends OpenTextQuestionView {
    constructor(question, settings) {
        super(question, settings);

        this._messagesListNode = this._container[0].querySelector('.cf-assisted-open__messages-list');

        this._question.messageReceiveEvent.on(this._onMessageReceive.bind(this));
        this._question.assist();
    }

    _onMessageReceive(message) {
        switch (message.type) {
            case AssistedOpenMessageTypes.Waiting:
                this._cleanMessages(true);
                this._addWaitingMessage();
                break;
            case AssistedOpenMessageTypes.Technical:
                this._cleanMessages(false);
                this._addTechnicalMessage(message.text);
                break;
            case AssistedOpenMessageTypes.Assistance:
                this._cleanMessages(true);
                this._addPromptMessage(message.text);
                break;
        }
    }

    _cleanMessages(keepPrompts = true) {
        if (!keepPrompts) {
            this._messagesListNode.innerText = '';
            return;
        }

        Array.from(this._messagesListNode.children)
            .filter(node => !node.classList.contains('cf-assisted-open__message--assistance'))
            .forEach(node => this._messagesListNode.removeChild(node));
    }

    _addPromptMessage(messageText) {
        if (Utils.isEmpty(messageText)) {
            return;
        }

        const newNode = document.createElement('div');
        newNode.classList.add('cf-assisted-open__message', 'cf-assisted-open__message--assistance');
        this._messagesListNode.insertBefore(newNode, this._messagesListNode.firstChild);
        this._typeLikeHuman(messageText, newNode);
    }

    _addTechnicalMessage(messageText) {
        if (Utils.isEmpty(messageText)) {
            return;
        }

        const newNode = document.createElement('div');
        newNode.classList.add('cf-assisted-open__message', 'cf-assisted-open__message--technical');
        newNode.innerText = messageText;
        this._messagesListNode.insertBefore(newNode, this._messagesListNode.firstChild);
    }

    _addWaitingMessage() {
        let waitingNode = this._messagesListNode.querySelector('.cf-assisted-open__message--waiting');
        if (!waitingNode) {
            waitingNode = document.createElement('div');
            waitingNode.classList.add('cf-assisted-open__message', 'cf-assisted-open__message--waiting');
            waitingNode.innerHTML = `<div class="cf-waiting-dots"><div class="cf-waiting-dots__items"></div></div>`;

            if (this._messagesListNode.firstChild) {
                this._messagesListNode.insertBefore(waitingNode, this._messagesListNode.firstChild);
            } else {
                this._messagesListNode.appendChild(waitingNode);
            }
        }
    }

    _typeLikeHuman(text, element) {
        let index = 0;

        function typeChar() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                const delay = Math.random() * 20 + 4;
                setTimeout(typeChar, delay);
            }
        }

        typeChar();
    }
}
