import React, { useContext, useState, useEffect, useRef } from 'react'
import { store } from '../../player-store'
import usePrevious from '../keyboard/previous'

const QuestionSelect = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const [state, setState] = useState({ paginateMin: 0, paginateMax: 8, visibleQuestions: [] })
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

	const selectQuestion = (index) => {
		dispatch({ type: 'select_question', payload: index })
	}

	// keyboard controls effects
	useEffect(() => {
		window.addEventListener('keydown', props.keyboardCtrlsQuestions)

		return () => { // cleaned up function
			window.removeEventListener('keydown', props.keyboardCtrlsQuestions)
		}
	}, [manager.state.currentIndex, manager.state.items])

	return (
		<div className="question-select">
			<button className={`select-btn paginate-up ${manager.state.items.length > 10 ? 'show' : ''} ${currentIndex > 0 ? '' : 'disabled'}`} onClick={() => { selectQuestion(currentIndex - 1) }} disabled={currentIndex <= 0}><span className="icon-arrow-up2"></span></button>
			{state.visibleQuestions}
			<button className={`select-btn paginate-down ${manager.state.items.length > 10 ? 'show' : ''} ${currentIndex < manager.state.items.length - 1 ? '' : 'disabled'}`} onClick={() => { selectQuestion(currentIndex + 1) }} disabled={currentIndex >= manager.state.items.length - 1}><span className="icon-arrow-down2"></span></button>
		</div>
	)
}

export default QuestionSelect