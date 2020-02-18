import React, { useContext, useEffect } from 'react';
import Question from './question'
import QuestionSelect from './question-select'
import PhraseBuilder from './phrase-builder'
import Legend from './legend'
import PrefSelect from './pref-select';
import { store } from '../../creator-store'

const CreatorApp = (props) => {

	console.log(props)

	const global = useContext(store)
	const dispatch = global.dispatch

	let items = []

	const init = () => {
		dispatch(
		{
			type: 'init',
			payload: {
				title: props.title,
				qset: props.qset
			}
		})
	}

	useEffect(() => {
		if (global.state.requireInit && props.performInit) {
			init()
		}
	})

	// shipQset(rawQset) {

	// 	let qset = rawQset

	// 	for (let i = 0; i < this.state.qset.length; i++) {

	// 		qset.items[i].id = null
	// 		qset.items[i].materiaType = "question"
	// 		qset.items[i].type = "language-widget"

	// 		// concat each question's phrase into the answer text string used for scoring
	// 		qset.items[i].answers[0].text = this.concatPhrase(qset.items[i].answers[0].options.phrase)
	// 	}

	// 	return qset
	// }

	// onSaveClicked() {
	// 	console.log(this.state.qset)
	// 	Materia.CreatorCore.save(this.state.title, shipQset(this.state.qset), 1)
	// }

	const handleTitleUpdate = (event) => {
		dispatch({type:'update_title', payload: event.target.value})
	}

	const handleDeleteQuestion = () => {

	}

	const handleAddNewQuestion = () => {

	}

	const toggleLegend = () => {
		dispatch({type: 'toggle_legend', payload: {}})
	}

	const concatPhrase = (phrase) => {
		let str = ''
		for (let i=0; i<phrase.length; i++) {
			str += phrase[i].value + ','
		}
		return str.substring(0,str.length-1)
	}

	return(
		<div className="creator-container">
			<header className="creator-header">
				<input value={global.state.title} onChange={handleTitleUpdate}/>
				<button className="toggleLegend" onClick={toggleLegend}>Legend</button>
			</header>
			 <QuestionSelect questions={global.state.items}></QuestionSelect>
			
			<section className="content-container">
				<Question></Question>
				
				<PhraseBuilder
					phrase={global.state.items[global.state.currentIndex].phrase}
					legend={global.state.legend}></PhraseBuilder>
				<PrefSelect></PrefSelect>
				<button className="card delete-question" onClick={handleDeleteQuestion} disabled={global.state.items.length < 2}>Delete Question</button>
			</section>
			<Legend show={global.state.showLegend ? global.state.showLegend : false} legend={global.state.legend} toggle={toggleLegend}></Legend>
		</div>
	)
}

export default CreatorApp;