import React, { useContext } from 'react'
import { store } from '../../creator-store'

const Question = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const index = global.state.currentIndex ? global.state.currentIndex : 0

	const onQuestionUpdate = (event) => {
		dispatch({type: 'update_question_text', payload:{ text: event.target.value, index: index}})
	}

	return(
		<section className="card question-container">
			<header>Question {global.state.currentIndex + 1} Text</header>
			<input
				value={global.state.items[index].question}
				onChange={onQuestionUpdate}
				placeholder="Add some text here describing the phrase below or providing instructions."></input>
		</section>
	)
}

export default Question