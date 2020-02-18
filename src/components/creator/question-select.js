import React, { useContext } from 'react'
import { store } from '../../creator-store'

const QuestionSelect = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const addNewQuestion = () => {
		dispatch({type: 'add_new_question'})
	}

	let questionList = props.questions.map((question, index) => {
		return <button className={`select-btn ${global.state.currentIndex == index ? 'selected' : ''}`} key={index} onClick={() => {dispatch({type: 'select_question', payload: index})}}>{index + 1}</button>
	})

	return (
		<div className="question-select">
			{questionList}
			<button className="select-btn add-new" onClick={addNewQuestion}>+</button>
		</div>
	)
}

export default QuestionSelect