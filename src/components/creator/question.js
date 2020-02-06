import React from 'react';

export default class Question extends React.Component {
	constructor(props) {
		super(props);

		this.onQuestionUpdate = this.onQuestionUpdate.bind(this)
	}

	onQuestionUpdate(event) {
		let text = event.target.value
		this.props.handleChangeQuestion(text)
	}
	
	render() {
		return(
			<section className="card question-container">
				<header>Question Text</header>
				<input
					value={this.props.value}
					onChange={this.onQuestionUpdate}
					placeholder="Add some text here describing the phrase below or providing instructions."></input>
			</section>
		)
	}
}