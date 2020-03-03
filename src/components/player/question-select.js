import React, { useContext } from 'react'
import { store } from '../../player-store'

const QuestionSelect = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	let questionList = global.state.items.map((item, index) => {
		return <button className={`select-btn ${global.state.currentIndex == index ? 'selected' : ''}`} key={index} onClick={() => {dispatch({type: 'select_question', payload: index})}}>{index + 1}</button>
	})
	
	return (
		<div className="question-select">
			{questionList}
		</div>
	)
}

export default QuestionSelect