import React from 'react';

export default class Question extends React.Component {
	constructor(props) {
		super(props);
			// this.state = {
			// 	value: this.props.qset.items[this.props.currentIndex].questions[0].text
			// }

		this.onQuestionUpdate = this.onQuestionUpdate.bind(this)
	}

	onQuestionUpdate(event) {
		let text = event.target.value
		this.props.handleChangeQuestion(text)
	}
	
	render() {
		return(
			<section className="question-container">
				<header>Question Text</header>
				<input
					value={this.props.value}
					onChange={this.onQuestionUpdate}></input>
			</section>
		)
	}
}