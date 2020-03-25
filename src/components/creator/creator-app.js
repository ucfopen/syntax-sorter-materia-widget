import React, { useContext, useEffect } from 'react';
import Question from './question'
import QuestionSelect from './question-select'
import PhraseBuilder from './phrase-builder'
import Legend from './legend'
import PrefSelect from './pref-select';
import { store } from '../../creator-store'
import CreatorTutorial from './creator-tutorial';

const CreatorApp = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const init = () => {

		if (props.newWidget) {
			dispatch({type: 'init-new'})
		}
		else {
			dispatch({
				type: 'init-existing',
				payload: {
					title: props.title,
					qset: props.qset
				}
			})
		}		
	}

	// using this as equivalent to componentDidMount
	useEffect(() => {
		if (global.state.requireInit) {
			init()
		}
	})

	// Materia callbacks
	props.callbacks.onSaveClicked = () => {

		// convert store to qset
		let qset = {
			items: global.state.items.map((item) => {
				return {
					id: null,
					materiaType: 'question',
					type: 'language-widget',
					questions: [{
						text: item.question
					}],
					answers: [{
						id: null,
						text: concatPhrase(item.phrase),
						options: {
							phrase: item.phrase
						}
					}],
					options: {
						displayPref: item.displayPref
					}
				}
			}),
			options: {
				legend: global.state.legend
			}
		}
		Materia.CreatorCore.save(global.state.title, qset, 1)
	}

	// concats phrase into text string (for qset export)
	const concatPhrase = (phrase) => {
		let str = ''
		for (let i=0; i<phrase.length; i++) {
			str += phrase[i].value + ','
		}
		return str.substring(0,str.length-1)
	}

	props.callbacks.onSaveComplete = () => {
		console.log("OK!")
	}

	const handleTitleUpdate = (event) => {
		dispatch({type:'update_title', payload: event.target.value})
	}

	const handleDeleteQuestion = () => {
		dispatch({type:'remove_question', payload: global.state.currentIndex})
	}

	const toggleLegend = () => {
		dispatch({type: 'toggle_legend', payload: {}})
	}

	return(
		<div className="creator-container">
			<CreatorTutorial></CreatorTutorial>
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