import React, { useContext, useEffect } from 'react'
import QuestionSelect from './question-select'
import PhrasePlayer from './phrase-player'
import PlayerTutorial from './player-tutorial'
import WarningModal from './warning-modal'
import { store } from '../../player-store'

const PlayerApp = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	useEffect(() => {
		if (global.state.requireInit) {
			dispatch({
				type: 'init', payload: {
					qset: props.qset,
					title: props.title
				}
			})

			document.addEventListener("mouseup", mouseUpHandler)
		}
	}, [global.state.requireInit])

	// Used to prevent reads from being highlighted then dragged
	const mouseUpHandler = () => {
		if (window.getSelection().toString().length > 0) {
			window.getSelection().removeAllRanges();
		}
	}

	const convertSortedForLogging = (sorted) => {

		let response = []
		for (let i = 0; i < sorted.length; i++) {

			for (const term of global.state.legend) {
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

		for (let item of global.state.items) {
			if (item.sorted.length <= 0) {
				isEmpty = true
				break
			}
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
		for (let item of global.state.items) {
			Materia.Score.submitQuestionForScoring(item.qsetId, convertSortedForLogging(item.sorted))
		}

		Materia.Engine.end(true)
	}

	const toggleTutorial = () => {
		dispatch({ type: 'toggle_tutorial' })
	}

	const questionText = global.state.items[global.state.currentIndex]?.question.length > 0 ? global.state.items[global.state.currentIndex].question : "Drag and drop to arrange the items below in the correct order."

	const legendList = global.state.legend.map((term, index) => {
		return <span key={index} className='legend-item'><span className='legend-color' style={{ background: term.color }}></span>{term.name}</span>
	})

	return (
		<div className="player-container">
			<WarningModal submitForScoring={submitForScoring}></WarningModal>
			<PlayerTutorial></PlayerTutorial>
			<header className="player-header">
				<span className="title">{global.state.title}</span>
				<button className="headerBtn" onClick={handleSubmit}>Submit</button>
				<button className="headerBtn" onClick={toggleTutorial}>Tutorial</button>
			</header>
			<QuestionSelect></QuestionSelect>
			<section className="content-container">
				<section className="card question-container">
					<p>{questionText}</p>
					<div className={'hint-text ' +
						`${(
							global.state.items[global.state.currentIndex]?.attemptsUsed > 0 &&
							global.state.items[global.state.currentIndex]?.attemptsUsed < global.state.items[global.state.currentIndex]?.attempts &&
							global.state.items[global.state.currentIndex]?.responseState != 'correct' &&
							global.state.items[global.state.currentIndex]?.responseState != 'incorrect-no-attempts' &&
							global.state.items[global.state.currentIndex]?.hint.length > 0) ? 'show' : ''}`}>
						<span className="strong">Hint: </span><span>{global.state.items[global.state.currentIndex]?.hint}</span>
					</div>
				</section>
				<PhrasePlayer
					phrase={global.state.items[global.state.currentIndex]?.phrase}
					sorted={global.state.items[global.state.currentIndex]?.sorted}
					displayPref={global.state.items[global.state.currentIndex]?.displayPref}
					attemptsUsed={global.state.items[global.state.currentIndex]?.attemptsUsed}
					attemptLimit={global.state.items[global.state.currentIndex]?.attempts}
					hasFakes={global.state.items[global.state.currentIndex]?.fakeout.length}
					responseState={global.state.items[global.state.currentIndex]?.responseState}></PhrasePlayer>
				<section className="card legend">
					<header>Color Legend</header>
					{legendList}
				</section>
			</section>
		</div>
	)
}

export default PlayerApp
