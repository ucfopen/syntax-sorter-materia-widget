import React, { useContext, useState, useEffect } from 'react'
import { store } from '../../creator-store'

const QuestionSelect = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const [state, setState] = useState({ paginateMin: 0, paginateMax: 8, visibleQuestions: [] })

	const MAX_QUESTIONS = 99
	const currentIndex = manager.state.currentIndex

	useEffect(() => {
		let questionList = manager.state.items.map((item, index) => {
			return <button className={`select-btn ${currentIndex == index ? 'selected' : ''}`} key={index} onClick={() => { selectQuestion(index) }}>{index + 1}</button>
		})

		// if the list of questions gets too long, we have to start computing the subset to display
		if (questionList.length > 10) {
			if (currentIndex < state.paginateMin) {
				setState(state => ({ ...state, paginateMin: currentIndex, paginateMax: currentIndex + 8 }))
			}
			else if (currentIndex > state.paginateMax) {
				setState(state => ({ ...state, paginateMin: currentIndex - 8, paginateMax: currentIndex }))
			}
			else {
				// deleting questions can cause the list of visible questions to shrink below 9 items, depending on currentIndex and its distance from the end of the array
				// ensure the visible question count always remains static by making sure the distance between min and max is constant

				// if the distance from the end of the list to min is > 9, set max to min + 8
				if ((questionList.length - 1) - state.paginateMin > 9) {
					setState(state => ({ ...state, paginateMax: state.paginateMin + 8 }))
				} else {
					// otherwise, set max to the end of the list, and set min to 9 indicies below it
					setState(state => ({ ...state, paginateMax: questionList.length - 1, paginateMin: questionList.length - 9 }))
				}
			}

			setState(state => ({
				...state, visibleQuestions: [
					...questionList.slice(state.paginateMin, currentIndex),
					...questionList.slice(currentIndex, state.paginateMax + 1)
				]
			}))
		}
		else {
			setState(state => ({ ...state, visibleQuestions: questionList }))
		}
	}, [manager.state.currentIndex, manager.state.items])

	const addNewQuestion = () => {
		if (manager.state.items.length >= MAX_QUESTIONS) return
		dispatch({ type: 'add_new_question' })
	}

	const selectQuestion = (index) => {
		dispatch({ type: 'select_question', payload: index })
	}

	return (
		<div className="question-select">
			<button className={`select-btn paginate-up ${manager.state.items.length > 10 ? 'show' : ''} ${currentIndex > 0 ? '' : 'disabled'}`} onClick={() => { selectQuestion(currentIndex - 1) }} disabled={currentIndex <= 0}><span className="icon-arrow-up2"></span></button>
			{state.visibleQuestions}
			<button className={`select-btn add-new ${manager.state.items.length >= MAX_QUESTIONS ? 'disabled' : ''}`} onClick={addNewQuestion} disabled={manager.state.items.length >= MAX_QUESTIONS}>+</button>
			<button className={`select-btn paginate-down ${manager.state.items.length > 10 ? 'show' : ''} ${currentIndex < manager.state.items.length - 1 ? '' : 'disabled'}`} onClick={() => { selectQuestion(currentIndex + 1) }} disabled={currentIndex >= manager.state.items.length - 1}><span className="icon-arrow-down2"></span></button>
		</div>
	)
}

export default QuestionSelect