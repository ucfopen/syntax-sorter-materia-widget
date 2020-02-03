import React from 'react';

export default class QuestionSelect extends React.Component {

	constructor(props) {
		super(props);
		this.renderList = this.renderList.bind(this)
	}

	handleSelectQuestion(index) {
		this.props.selectQuestion(index)
	}

	renderList() {

		const list = []

		for (let i = 0; i < this.props.questions.length; i++) {
			const question = {}
			question.index = i + 1
			question.text = this.props.questions[i].questions[0].text

			let bindSelectQuestion = this.handleSelectQuestion.bind(this,i)

			list.push(<button className="select-btn" key={i} onClick={bindSelectQuestion}>{question.index}</button>)

		}
		return list
	}

	render() {
		return(
			<div className="question-select">
				{this.renderList()}
			</div>
		)
	}
}