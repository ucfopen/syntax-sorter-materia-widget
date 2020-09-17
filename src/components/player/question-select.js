import React, { useContext } from 'react'
import { store } from '../../player-store'

const QuestionSelect = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const currentIndex = global.state.currentIndex

	let questionList = global.state.items.map((item, index) => {
		return <button className={`select-btn ${currentIndex == index ? 'selected' : ''}`} key={index} onClick={() => {dispatch({type: 'select_question', payload: index})}}>{index + 1}</button>
	})

	let visibleQuestionList = questionList
	if (questionList.length > 11) {
		let min = currentIndex < 10 ? 0 : currentIndex - 10
		let max = min + 11

		if (currentIndex + 1 > questionList.length - 1) {
			visibleQuestionList = [
				...questionList.slice(min, currentIndex),
				...questionList.slice(currentIndex)
			]
		}
		else { 
			visibleQuestionList = [
				...questionList.slice(min, currentIndex),
				...questionList.slice(currentIndex, max)
			]
		}
	}
	
	return (
		<div className="question-select">
			<button className={`select-btn paginate-up ${questionList.length > 11 ? 'show' : ''} ${currentIndex > 0 ? '': 'disabled'}`} onClick={() => {dispatch({type: 'select_question', payload: currentIndex - 1})}} disabled={currentIndex <= 0}><span className="icon-arrow-up2"></span></button>
			{visibleQuestionList}
			<button className={`select-btn paginate-down ${questionList.length > 11 ? 'show' : ''} ${currentIndex < questionList.length - 1 ? '': 'disabled'}`} onClick={() => {dispatch({type: 'select_question', payload: currentIndex + 1})}} disabled={currentIndex >= questionList.length - 1}><span className="icon-arrow-down2"></span></button>
		</div>
	)
}

export default QuestionSelect