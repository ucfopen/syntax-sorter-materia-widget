import React, { useContext, useState, useEffect, useRef } from 'react'
import { store } from '../../player-store'
import QuestionSelect from './question-select'
import PhrasePlayer from './phrase-player'
import PlayerTutorial from './player-tutorial'
import WarningModal from './warning-modal'

const PlayerApp = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const isMounted = useRef(false)
	const targetItem = useRef(null)

	const [showHint, setShowHint] = useState(false)

	useEffect(() => {
		document.addEventListener('keydown', getFocusItem)

		return () => {
			document.removeEventListener('keydown', getFocusItem)
		}

	}, [])

	const getFocusItem = (event) => {
		if (targetItem.current != null) {
			targetItem.current.classList.remove('simple-highlight')
		}

		if (event.target.tagName == 'BODY') { return }

		targetItem.current = event.target
		targetItem.current.classList.add('simple-highlight')
		targetItem.current.focus()
	}

	useEffect(() => {
		if (manager.state.requireInit) {
			dispatch({
				type: 'init', payload: {
					qset: props.qset,
					title: props.title
				}
			})

			document.addEventListener("mouseup", mouseUpHandler)
		}
	}, [manager.state.requireInit])

	useEffect(() => {
		setShowHint(() => {
			return (
				manager.state.items[manager.state.currentIndex]?.attemptsUsed > 0
				&& manager.state.items[manager.state.currentIndex]?.attemptsUsed < manager.state.items[manager.state.currentIndex]?.attempts
				&& manager.state.items[manager.state.currentIndex]?.responseState != 'correct'
				&& manager.state.items[manager.state.currentIndex]?.responseState != 'incorrect-no-attempts'
				&& manager.state.items[manager.state.currentIndex]?.hint.length > 0
			) ? 'show' : ''
		})
	}, [manager.state.items, manager.state.currentIndex])

	/* A way to check if the component is mounted. */
	useEffect(() => {
		isMounted.current = true

		return () => {
			isMounted.current = false
		}
	}, [])

	// Used to prevent reads from being highlighted then dragged
	const mouseUpHandler = () => {
		if (window.getSelection().toString().length > 0) {
			window.getSelection().removeAllRanges();
		}
	}

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
				dispatch({ type: 'select_question', payload: i })
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
		// write code that translate the hex value to a color str value.
		return (
			<span key={index} className='legend-item'>
				<span className='legend-color' style={{ background: term.color }}></span>
				{term.name}
			</span>
		)
	})

	return (
		<div className="player-container" role={'tabpanel'}>
			<WarningModal submitForScoring={submitForScoring} requireAllQuestions={manager.state.requireAllQuestions} />
			<PlayerTutorial />
			<header className="player-header">
				<span className="title">{manager.state.title}</span>
				<button
					className="headerBtn"
					tabIndex={(manager.state.showTutorial === false && manager.state.showWarning === false) ? 0 : -1}
					onClick={handleSubmit}
					onKeyDown={event => {
						if (event.key === 'Enter') { handleSubmit }
					}}
				>
					Submit
				</button>
				<button
					className="headerBtn"
					tabIndex={(manager.state.showTutorial === false && manager.state.showWarning === false) ? 0 : -1}
					onClick={toggleTutorial}
					onKeyDown={event => {
						if (event.key === 'Enter') { toggleTutorial }
					}}
				>
					Tutorial
				</button>
			</header>

			<QuestionSelect />

			<section className="content-container">
				<section className="card question-container" role={'tablist'}>
					<p>{questionText}</p>
					{
						showHint === 'show'
							? <div className={'hint-text ' + `${showHint}`}>
								<span className="strong">Hint: </span>
								<span>{manager.state.items[manager.state.currentIndex]?.hint}</span>
							</div>
							: <div className={'hint-text ' + `${showHint}`} aria-hidden={'true'} />
					}
				</section>

				<PhrasePlayer
					phrase={manager.state.items[manager.state.currentIndex]?.phrase}
					sorted={manager.state.items[manager.state.currentIndex]?.sorted}
					displayPref={manager.state.items[manager.state.currentIndex]?.displayPref}
					attemptsUsed={manager.state.items[manager.state.currentIndex]?.attemptsUsed}
					attemptLimit={manager.state.items[manager.state.currentIndex]?.attempts}
					hasFakes={manager.state.items[manager.state.currentIndex]?.fakeout.length}
					responseState={manager.state.items[manager.state.currentIndex]?.responseState}
				/>

				<section className="card legend" aria-hidden>
					<header>Color Legend</header>
					{legendList}
				</section>

			</section>
		</div >
	)
}

export default PlayerApp
