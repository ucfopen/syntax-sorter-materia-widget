import React, {useContext, useEffect} from 'react'
import QuestionSelect from './question-select'
import PhrasePlayer from './phrase-player'
import PlayerTutorial from './player-tutorial'
import { store } from '../../player-store'

const PlayerApp = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch
	const currentCheckPref = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].checkPref : 'no'
	const currentChecksUsed = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].checksUsed : 0
	const maxChecks = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].numChecks : 0
	const currentAnswerVal = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].correct : 'none'

	useEffect(() => {
		if (global.state.requireInit) {
			dispatch({type: 'init', payload: {
				qset: props.qset,
				title: props.title
			}})
		}
	}, [global.state.requireInit])

	const convertSortedToString = (sorted, pref = 'word') => {
		let string = ''
		for (let i=0;i<sorted.length;i++) {
			if (pref == 'word') string += sorted[i].value + ','
			else {
				for (const term of global.state.legend) {
					if (parseInt(sorted[i].legend) == term.id) string += term.name + ','
				}
			}
		}
		return string.substring(0,string.length-1)
	}

	const handleCheck = () => {

		// Disables the button if the number of checks has been reached
		if (currentAnswerVal == "yes" || currentChecksUsed >= maxChecks)
		{
			return
		}

		let item = global.state.items[global.state.currentIndex]
		let correct = "yes"
		let correctPhrase = item.correctPhrase
		let sortedArr = item.sorted

		// Answer is of the incorrect size
		if (sortedArr.length != correctPhrase.length)
		{
			correct = "no"
		}

		if (correct == "yes" && item.displayPref == "word")
		{
			// Makes sure the text of the answer array and user sorted array are the same
			for (let i = 0; i < correctPhrase.length; i++)
			{
				if (correctPhrase[i].value != item.sorted[i].value)
				{
					correct = "no"
				}
			}
		}
		else if (correct == "yes" && item.displayPref == "part-of-speech")
		{
			// Makes sure the parts of speech of the answer array and user sorted array are the same
			for (let i = 0; i < correctPhrase.length; i++)
			{
				if (correctPhrase[i].legend != item.sorted[i].legend)
				{
					console.log(item.sorted[i].value)
					correct = "no"
				}
			}
		}

		dispatch({type: 'correct_update', payload: {
			questionIndex: global.state.currentIndex,
			answer: correct
		}})

	}

	const handleSubmit = () => {

		for (let item of global.state.items) {
			Materia.Score.submitQuestionForScoring(item.qsetId, convertSortedToString(item.sorted, item.displayPref))
		}
		Materia.Engine.end(true)
	}

	const legendList = global.state.legend.map((term, index) => {
		return <span key={index} className='legend-item'><span className='legend-color' style={{background: term.color}}></span>{term.name}</span>
	})

	return(
		<div className="player-container">
			<PlayerTutorial></PlayerTutorial>
			<header className="player-header">
				{global.state.title}
				<button className="submit" onClick={handleSubmit}>Submit</button>
			</header>
			<QuestionSelect></QuestionSelect>
			<section className="content-container">
				<section className="card question-container">
					<p>{global.state.items[global.state.currentIndex]?.question}</p>
					<p className={`answer-indicator ${currentAnswerVal == "yes" ? "show" : ""}`}>Correct</p>
					<p className={`answer-indicator wrong ${currentAnswerVal == "no" ? "show" : ""}`}>Incorrect</p>
				</section>
				<PhrasePlayer
					phrase={global.state.items[global.state.currentIndex]?.phrase}
					sorted={global.state.items[global.state.currentIndex]?.sorted}
					displayPref={global.state.items[global.state.currentIndex]?.displayPref}></PhrasePlayer>
				<section className="card legend">
					<header>Color Legend</header>
					{legendList}
				</section>
				<section className={`check-holder ${currentCheckPref == "yes" ? "show" : ""}`}>
					<span className="check-val">Checks left: {maxChecks-currentChecksUsed} / {maxChecks}</span>
					<button className={`check-btn ${currentChecksUsed >= maxChecks ? "disabled" : ""}`} onClick={handleCheck}>Check</button>
				</section>
			</section>
		</div>
	)
}

export default PlayerApp
