import React, {useContext, useEffect} from 'react'
import QuestionSelect from './question-select'
import PhrasePlayer from './phrase-player'
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
		return string.substring(0,string.length-1)
	}

	const handleSubmit = () => {

		for (let item of global.state.items) {
			Materia.Score.submitQuestionForScoring(item.qsetId, convertSortedToString(item.sorted, item.displayPref))
		}
		Materia.Engine.end(true)
	}

	return(
		<div className="player-container">
			<header className="player-header">
				{global.state.title}
				<button className="submit" onClick={handleSubmit}>Submit</button>
			</header>
			<QuestionSelect></QuestionSelect>
			<section className="content-container">
				<section className="card question-container">
					<p>{global.state.items[global.state.currentIndex]?.question}</p>
				</section>
				<PhrasePlayer
					phrase={global.state.items[global.state.currentIndex]?.phrase}
					sorted={global.state.items[global.state.currentIndex]?.sorted}
					displayPref={global.state.items[global.state.currentIndex]?.displayPref}></PhrasePlayer>
			</section>
		</div>
	)
}

export default PlayerApp