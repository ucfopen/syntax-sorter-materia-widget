import React, { useContext } from 'react'
import { store } from '../../creator-store'

const Question = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const index = manager.state.currentIndex ? manager.state.currentIndex : 0

	const onQuestionUpdate = (event) => {
		dispatch({ type: 'update_question_text', payload: { text: event.target.value, index: index } })
	}

	return (
		<section className="card question-container">
			<header>Question {manager.state.currentIndex + 1} Text</header>
			<input
				value={manager.state.items[index].question}
				onChange={onQuestionUpdate}
				placeholder="Add some text here describing the phrase below or providing instructions."></input>
		</section>
	)
}

export default Question