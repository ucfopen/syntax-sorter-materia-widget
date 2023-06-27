import React, { useContext, useEffect } from 'react'
import QuestionSelect from './question-select'
import PhrasePlayer from './phrase-player'
import PlayerTutorial from './player-tutorial'
import WarningModal from './warning-modal'
import AriaLive from './aria-live'
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

			document.addEventListener("mouseup", mouseUpHandler)
		}
	}, [manager.state.requireInit])

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
		return <div key={index} aria-label={term.name}>
			<dt className='legend-color' style={{ background: term.color }} aria-label="Color" aria-hidden="true"></dt>
			<dd aria-hidden="true">{term.name}</dd>
		</div>
	})

	const getLegendName = (type) => {
		for (const term of manager.state.legend) {
			if (type == term.id) return term.name
		}
	}

	const handleOnKeyDown = (event) => {
		if (event.key == "R" || event.key == "r")
		{
			readCurrentPhrase();
		}
		else if (event.key == "H" || event.key == "h")
		{
			readHint();
		}
	}

	const readHint = () => {
		var msg = new SpeechSynthesisUtterance();

		if (manager.state.items[manager.state.currentIndex]?.attemptsUsed > 0 && manager.state.items[manager.state.currentIndex]?.attemptsUsed < manager.state.items[manager.state.currentIndex]?.attempts &&manager.state.items[manager.state.currentIndex]?.responseState != 'correct' && manager.state.items[manager.state.currentIndex]?.responseState != 'incorrect-no-attempts' && manager.state.items[manager.state.currentIndex]?.hint.length > 0)
		{
			msg.text = manager.state.items[manager.state.currentIndex].hint;
		}
		else
		{
			msg.text = "No hint available."
		}
		window.speechSynthesis.speak(msg);
	}

	const readCurrentPhrase = () => {
		var msg = new SpeechSynthesisUtterance();

		var currentQuestion = manager.state.items[manager.state.currentIndex];

		if (currentQuestion.sorted.length < 1)
		{
			msg.text = "Empty."
		}
		else
		{
			let sortedPhrase = currentQuestion.sorted.map((token) => {
				return (currentQuestion.displayPref == 'word' ? token.value : getLegendName(token.legend))
			}).join(" ");

			msg.text = sortedPhrase;
		}
		window.speechSynthesis.speak(msg);
	}

	return (
		<div className="player-container"
		onKeyDown={handleOnKeyDown}>
			<AriaLive></AriaLive>
			<WarningModal
				submitForScoring={submitForScoring}
				requireAllQuestions={manager.state.requireAllQuestions}></WarningModal>
			<PlayerTutorial></PlayerTutorial>
			<header className="player-header">
				<h1 className="title">{manager.state.title}</h1>
				<div className="player-header-btns">
					<button className="headerBtn" onClick={toggleTutorial}>Tutorial</button>
					<button className="headerBtn" onClick={handleSubmit}>Submit</button>
				</div>
			</header>
			<QuestionSelect></QuestionSelect>
			<main className="content-container">
				<section className="card question-container">
					<h2 id="question-text" aria-label={"Question: " + questionText}>{questionText}</h2>
					<div aria-live="polite" className={'hint-text ' +
						`${(
							manager.state.items[manager.state.currentIndex]?.attemptsUsed > 0 &&
							manager.state.items[manager.state.currentIndex]?.attemptsUsed < manager.state.items[manager.state.currentIndex]?.attempts &&
							manager.state.items[manager.state.currentIndex]?.responseState != 'correct' &&
							manager.state.items[manager.state.currentIndex]?.responseState != 'incorrect-no-attempts' &&
							manager.state.items[manager.state.currentIndex]?.hint.length > 0) ? 'show' : ''}`}>
						<p><span className="strong">Hint: </span>
						<span>{manager.state.items[manager.state.currentIndex]?.hint}</span></p>
					</div>
				</section>
				<PhrasePlayer
					phrase={manager.state.items[manager.state.currentIndex]?.phrase}
					sorted={manager.state.items[manager.state.currentIndex]?.sorted}
					displayPref={manager.state.items[manager.state.currentIndex]?.displayPref}
					attemptsUsed={manager.state.items[manager.state.currentIndex]?.attemptsUsed}
					attemptLimit={manager.state.items[manager.state.currentIndex]?.attempts}
					hasFakes={manager.state.items[manager.state.currentIndex]?.fakeout.length}
					responseState={manager.state.items[manager.state.currentIndex]?.responseState}
					readCurrentPhrase={readCurrentPhrase}></PhrasePlayer>
				<section className="card legend">
					<header id="color-legend-header">Color Legend</header>
					<dl aria-labelledby="color-legend-header">
						{legendList}
					</dl>
				</section>
			</main>
		</div>
	)
}

export default PlayerApp
