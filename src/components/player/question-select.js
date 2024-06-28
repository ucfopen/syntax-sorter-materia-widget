import React, { useContext, useState, useEffect } from 'react'
import { store, DispatchContext } from '../../player-store'

const QuestionSelect = (props) => {

	const state = useContext(store)
	const dispatch = useContext(DispatchContext)

	const [localState, setState] = useState({ paginateMin: 0, paginateMax: 8, visibleQuestions: [] })

	const currentIndex = state.currentIndex

	useEffect(() => {
		let questionList = state.items.map((item, index) => {
			let questionStatus = ''
			switch (item.responseState)
			{
				case 'none':
					questionStatus = "Incomplete"
					break;
				case 'pending':
					questionStatus = "Incomplete"
					break;
				case 'ready':
					questionStatus = "Sorted but not submitted"
					break;
				case 'incorrect-no-attempts':
					questionStatus = "Incorrect: no attempts remaining"
					break;
				case 'incorrect-attempts-remaining':
					questionStatus = `Incorrect: ${item.attempts - item.attemptsUsed} attempt${item.attempts - item.attemptsUsed > 1 ? 's' : ''} remaining`
					break;
				case 'correct':
					questionStatus = "Correct"
					break;
				default:
					questionStatus = "Incomplete"
					break;
			}
			return <button
				id={`question-${index + 1}-btn`}
				className={`select-btn ${currentIndex == index ? 'selected' : ''}`}
				key={index}
				onClick={() => { selectQuestion(index) }}
				aria-label={`Question ${index + 1}: ${questionStatus}`}>{index + 1}
			</button>
		})

		// if the list of questions gets too long, we have to start computing the subset to display
		if (questionList.length > 10) {
			if (currentIndex < localState.paginateMin) {
				setState(localState => ({ ...localState, paginateMin: currentIndex, paginateMax: currentIndex + 8 }))
			}
			else if (currentIndex > localState.paginateMax) {
				setState(localState => ({ ...localState, paginateMin: currentIndex - 8, paginateMax: currentIndex }))
			}

			setState(localState => ({...localState, visibleQuestions: [
				...questionList.slice(localState.paginateMin, currentIndex),
				...questionList.slice(currentIndex, localState.paginateMax + 1)
			]}))
		}
		else {
			setState(localState => ({ ...localState, visibleQuestions: questionList }))
		}
	}, [state.currentIndex, state.items])

	const selectQuestion = (index) => {
		dispatch({ type: 'select_question', payload: index })
		try { document.getElementById("question-text").focus(); } catch(err) { throw err };
	}

	return (
		<nav className="question-select"
		inert={state.showTutorial || state.showWarning ? '' : undefined}
		aria-hidden={state.showTutorial || state.showWarning ? "true" : "false"}>
			<button className={`select-btn paginate-up ${state.items.length > 10 ? 'show' : ''} ${currentIndex > 0 ? '' : 'disabled'}`} onClick={() => { selectQuestion(currentIndex - 1) }} disabled={currentIndex <= 0}><span className="icon-arrow-up2"></span></button>
			{localState.visibleQuestions}
			<button className={`select-btn paginate-down ${state.items.length > 10 ? 'show' : ''} ${currentIndex < state.items.length - 1 ? '' : 'disabled'}`} onClick={() => { selectQuestion(currentIndex + 1) }} disabled={currentIndex >= state.items.length - 1}><span className="icon-arrow-down2"></span></button>
		</nav>
	)
}

export default QuestionSelect
