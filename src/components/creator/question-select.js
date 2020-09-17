import React, { useContext } from 'react'
import { store } from '../../creator-store'

const QuestionSelect = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const currentIndex = global.state.currentIndex

	const addNewQuestion = () => {
		dispatch({type: 'add_new_question'})
	}

	let questionList = props.questions.map((question, index) => {
		return <button className={`select-btn ${global.state.currentIndex == index ? 'selected' : ''}`} key={index} onClick={() => {dispatch({type: 'select_question', payload: index})}}>{index + 1}</button>
	})

	let visibleQuestionList = questionList
	if (questionList.length > 10) {
		let min = currentIndex < 9 ? 0 : currentIndex - 9
		let max = min + 10

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
			<button className={`select-btn paginate-up ${questionList.length > 10 ? 'show' : ''} ${currentIndex > 0 ? '': 'disabled'}`} onClick={() => {dispatch({type: 'select_question', payload: currentIndex - 1})}} disabled={currentIndex <= 0}><span className="icon-arrow-up2"></span></button>
			{visibleQuestionList}
			<button className="select-btn add-new" onClick={addNewQuestion}>+</button>
			<button className={`select-btn paginate-down ${questionList.length > 10 ? 'show' : ''} ${currentIndex < questionList.length - 1 ? '': 'disabled'}`} onClick={() => {dispatch({type: 'select_question', payload: currentIndex + 1})}} disabled={currentIndex >= questionList.length - 1}><span className="icon-arrow-down2"></span></button>
		</div>
	)
}

export default QuestionSelect