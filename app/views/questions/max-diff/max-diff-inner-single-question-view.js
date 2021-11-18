import $ from 'jquery';
import QuestionViewBase from '../base/question-view-base';
import QuestionIdProvider from '../../helpers/question-id-provider';
import Utils from './../../../utils';

export default class MaxDiffInnerSingleQuestionView extends QuestionViewBase {
    constructor(parent, question, settings = null) {
        super(question, settings);

        this._parent = parent;
        this._container = $(`#${parent.id}`);

        this._idProvider = new QuestionIdProvider(this._question.id);

        this._attachHandlersToDOM();
    }

    _getAnswerNode(answerCode) {
        return $('#' + this._idProvider.getAnswerNodeId(answerCode));
    }

    _getAnswerControlNode(answerCode) {
        return $('#' + this._idProvider.getAnswerControlNodeId(answerCode));
    }

    _attachHandlersToDOM() {
        this._question.answers.forEach((answer) => {
            this._getAnswerNode(answer.code).on('click', () => this._onAnswerNodeClick(answer));
        });
    }

    _onAnswerNodeClick(answer) {
        // disallow selecting the same answer twice
        if (this._parent.innerQuestions.find((x) => x !== this && x.value === answer.code)) return;
        this._question.setValue(answer.code);
    }

    _onModelValueChange({ changes }) {
        if (changes.value === undefined) {
            return;
        }

        this._question.answers.forEach((answer) => {
            this._getAnswerNode(answer.code).removeClass('cf-radio-answer--selected');
            this._getAnswerControlNode(answer.code)
                .removeClass('cf-radio--selected')
                .attr('aria-checked', 'false')
                .css('background-color', '')
                .css('border-color', '');
        });

        if (this._question.value === null) {
            return;
        }

        const answer = this._question.getAnswer(this._question.value);
        this._getAnswerNode(answer.code).addClass('cf-radio-answer--selected');

        const answerControlNode = this._getAnswerControlNode(answer.code);
        answerControlNode.addClass('cf-radio--selected').attr('aria-checked', 'true');

        if (!Utils.isEmpty(answer.backgroundColor)) {
            answerControlNode.css({ backgroundColor: answer.backgroundColor, borderColor: answer.backgroundColor });
        }
    }
}
