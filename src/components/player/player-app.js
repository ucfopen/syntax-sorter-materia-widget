import React, { useContext, useEffect } from 'react'
import QuestionSelect from './question-select'
import PhrasePlayer from './phrase-player'
import PlayerTutorial from './player-tutorial'
import WarningModal from './warning-modal'
import { store } from '../../player-store'

const PlayerApp = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	useEffect(() => {
		if (manager.state.requireInit) {
			dispatch({
				type: 'init', payload: {
					qset: props.qset,
					title: props.title
				}
			})
		}
	}, [manager.state.requireInit])

	const convertSortedForLogging = (sorted) => {

		let response = []
		for (let i = 0; i < sorted.length; i++) {

			for (const term of manager.state.legend) {
				if (parseInt(sorted[i].legend) == term.id) var legend = term.name
			}

			response.push({
				value: sorted[i].value,
				legend: legend
			})
		}

		return JSON.stringify(response)
	}

	const emptyQuestionCheck = () => {

		let isEmpty = false
		let i = 0;

		for (let item of manager.state.items) {
			if (item.sorted.length <= 0) {
				dispatch({type: 'select_question', payload: i})
				isEmpty = true
				break
			}
			i++
		}
		return isEmpty
	}

	const handleSubmit = () => {

		if (emptyQuestionCheck() == true) {
			dispatch({ type: 'toggle_warning' })
			return
		}
		else {
			submitForScoring()
		}
	}

	const submitForScoring = () => {
		for (let item of manager.state.items) {
			Materia.Score.submitQuestionForScoring(item.qsetId, convertSortedForLogging(item.sorted))
		}

		Materia.Engine.end(true)
	}

	const toggleTutorial = () => {
		dispatch({ type: 'toggle_tutorial' })
	}

	const questionText = manager.state.items[manager.state.currentIndex]?.question.length > 0 ? manager.state.items[manager.state.currentIndex].question : "Drag and drop to arrange the items below in the correct order."

	const legendList = manager.state.legend.map((term, index) => {
		return <span key={index} className='legend-item'><span className='legend-color' style={{ background: term.color }}></span>{term.name}</span>
	})

	return (
		<div className="player-container">
			<WarningModal
				submitForScoring={submitForScoring}
				requireAllQuestions={props.qset.options.requireAllQuestions}></WarningModal>
			<PlayerTutorial></PlayerTutorial>
			<header className="player-header">
				<span className="title">{manager.state.title}</span>
				<button className="headerBtn" onClick={handleSubmit}>Submit</button>
				<button className="headerBtn" onClick={toggleTutorial}>Tutorial</button>
			</header>
			<QuestionSelect></QuestionSelect>
			<section className="content-container">
				<section className="card question-container">
					<p>{questionText}</p>
					<div className={'hint-text ' +
						`${(
							manager.state.items[manager.state.currentIndex]?.attemptsUsed > 0 &&
							manager.state.items[manager.state.currentIndex]?.attemptsUsed < manager.state.items[manager.state.currentIndex]?.attempts &&
							manager.state.items[manager.state.currentIndex]?.responseState != 'correct' &&
							manager.state.items[manager.state.currentIndex]?.responseState != 'incorrect-no-attempts' &&
							manager.state.items[manager.state.currentIndex]?.hint.length > 0) ? 'show' : ''}`}>
						<span className="strong">Hint: </span><span>{manager.state.items[manager.state.currentIndex]?.hint}</span>
					</div>
				</section>
				<PhrasePlayer
					phrase={manager.state.items[manager.state.currentIndex]?.phrase}
					sorted={manager.state.items[manager.state.currentIndex]?.sorted}
					displayPref={manager.state.items[manager.state.currentIndex]?.displayPref}
					attemptsUsed={manager.state.items[manager.state.currentIndex]?.attemptsUsed}
					attemptLimit={manager.state.items[manager.state.currentIndex]?.attempts}
					hasFakes={manager.state.items[manager.state.currentIndex]?.fakeout.length}
					responseState={manager.state.items[manager.state.currentIndex]?.responseState}></PhrasePlayer>
				<section className="card legend">
					<header>Color Legend</header>
					{legendList}
				</section>
			</section>
		</div>
	)
}

export default PlayerApp
