import React, {useContext, useEffect} from 'react'
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

		if (string.length == 0)
			string = ','

		return string.substring(0,string.length-1)
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

		if (emptyQuestionCheck() == true)
		{
			dispatch({type: 'toggle_warning'})
			return
		}

		for (let item of global.state.items) {
			Materia.Score.submitQuestionForScoring(item.qsetId, convertSortedToString(item.sorted, item.displayPref))
		}

		Materia.Engine.end(true)
	}

	const toggleTutorial = () => {
		dispatch({type: 'toggle_tutorial'})
	}

	const legendList = global.state.legend.map((term, index) => {
		return <span key={index} className='legend-item'><span className='legend-color' style={{background: term.color}}></span>{term.name}</span>
	})

	return(
		<div className="player-container">
			<WarningModal></WarningModal>
			<PlayerTutorial></PlayerTutorial>
			<header className="player-header">
				{global.state.title}
				<button className="headerBtn" onClick={handleSubmit}>Submit</button>
				<button className="headerBtn" onClick={toggleTutorial}>Tutorial</button>
			</header>
			<QuestionSelect></QuestionSelect>
			<section className="content-container">
				<section className="card question-container">
					<p>{global.state.items[global.state.currentIndex]?.question}</p>
					<div className={'hint-text ' +
					`${(
						global.state.items[global.state.currentIndex]?.checkPref &&
						global.state.items[global.state.currentIndex]?.checksUsed > 0 && 
						global.state.items[global.state.currentIndex]?.checksUsed < global.state.items[global.state.currentIndex]?.numChecks + 1 &&
						global.state.items[global.state.currentIndex]?.responseState != 'correct' &&
						global.state.items[global.state.currentIndex]?.responseState != 'incorrect-no-attempts' &&
						global.state.items[global.state.currentIndex]?.hint.length > 0) ? 'show' : ''}`}>
						<h5>Hint:</h5>
						<span>{global.state.items[global.state.currentIndex]?.hint}</span>
				</div>
				</section>
				<PhrasePlayer
					phrase={global.state.items[global.state.currentIndex]?.phrase}
					sorted={global.state.items[global.state.currentIndex]?.sorted}
					displayPref={global.state.items[global.state.currentIndex]?.displayPref}
					guessPref={global.state.items[global.state.currentIndex]?.checkPref}
					attemptsUsed={global.state.items[global.state.currentIndex]?.checksUsed}
					attemptLimit={global.state.items[global.state.currentIndex]?.numChecks + 1}
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
