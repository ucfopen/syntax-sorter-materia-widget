import React, { useContext, useEffect } from 'react';
import Question from './question'
import QuestionSelect from './question-select'
import PhraseBuilder from './phrase-builder'
import Legend from './legend'
import PrefSelect from './pref-select';
import { store } from '../../creator-store'
import CreatorTutorial from './creator-tutorial';
import CreatorHintsModal from './creator-hints-modal';
import CreatorFakeoutModal from './creator-fakeout-modal'
import CreatorBankModal from './creator-bank-modal'
import CreatorErrorModal from './creator-error-modal'

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

	// Used to validate the data before saving.
	const validateData = () => {
		let invalid = []

		global.state.items.forEach((item, index) => {
			// Test to make sure a phrase has atleast one token
			if (item.phrase.length <= 0) invalid.push(`Question ${index+1} needs at least one phrase token.`)

			item.phrase.forEach((token, index) => {
				if (token.legend == null) invalid.push(`Question ${index+1} phrase token "${token.value}" is missing a legend type selection.`)
			})

			item.fakes.forEach((fake, index) => {
				if (fake.legend == null) invalid.push(`Question ${index+1} has a fake token "${fake.value}" without a legend type selection.`)
			})
		})

		var blankLegendCount = 0
		var duplicates = []

		global.state.legend.forEach((term, index) => {
			// make sure a legend value isn't blank
			if (!term.name.length) {
				blankLegendCount++
			}
			else {
				// check for duplicate legend values
				global.state.legend.forEach((otherTerm, otherIndex) => {
					if (term.name == otherTerm.name && index != otherIndex && !duplicates.includes(term.name)) {
						duplicates.push(term.name)
						invalid.push(`You have two or more legend items with the name "${term.name}". They must be unique!`)
					}
				})
			}
		})

		if (blankLegendCount > 0) invalid.push(`You have ${blankLegendCount} blank Legend value(s).`)

		return invalid
	}

	// Materia callbacks
	props.callbacks.onSaveClicked = () => {

		// Validation
		let invalid = validateData()

		// Make this only greater than after done testing
		if (invalid.length > 0)
		{
			dispatch({
				type: 'toggle_error_modal',
				payload: {
					error: invalid
				}
			})
			Materia.CreatorCore.cancelSave()
			return
		}

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
						displayPref: item.displayPref,
						attempts: item.attempts,
						hint: item.hint,
						fakes: item.fakes
					}
				}
			}),
			options: {
				legend: global.state.legend,
				enableQuestionBank: global.state.enableQuestionBank,
				numAsk: global.state.numAsk
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

	const toggleBank = () => {
		dispatch({type: 'toggle_bank_modal', payload: {}})
	}

	return(
		<div className="creator-container">
			<div className={`startupTooltip ${global.state.onboarding ? 'show' : ''}`} onClick={toggleLegend}>
				Open the Legend to start defining individual labels for phrase tokens.
			</div>
			<CreatorTutorial></CreatorTutorial>
			<CreatorHintsModal
				attempts={global.state.items[global.state.currentIndex].attempts}
				hint={global.state.items[global.state.currentIndex].hint}></CreatorHintsModal>
			<CreatorBankModal
				enableQuestionBank={global.state.enableQuestionBank}
				numAsk={global.state.numAsk}
				questionCount={global.state.items.length}></CreatorBankModal>
			<CreatorFakeoutModal
				fakes={global.state.items[global.state.currentIndex].fakes}></CreatorFakeoutModal>
			
			<CreatorErrorModal></CreatorErrorModal>
			<header className="creator-header">
				<input value={global.state.title} onChange={handleTitleUpdate} placeholder="Give Your Widget a Title"/>
				<button className="toggleLegend" onClick={toggleLegend}>Legend</button>
				<button className="toggleBank" onClick={toggleBank}>Question Bank</button>
			</header>
			<QuestionSelect questions={global.state.items}></QuestionSelect>
			<section className="content-container">
				<Question></Question>
				<PhraseBuilder
					phrase={global.state.items[global.state.currentIndex].phrase}
					legend={global.state.legend}
					showTokenTutorial={global.state.showTokenTutorial}
					format="phrase">
				</PhraseBuilder>
				<PrefSelect
					displayPref={global.state.items[global.state.currentIndex].displayPref}
					fakes={global.state.items[global.state.currentIndex].fakes}
					attempts={global.state.items[global.state.currentIndex].attempts}
					hint={global.state.items[global.state.currentIndex].hint}></PrefSelect>
				<button className="card delete-question" onClick={handleDeleteQuestion} disabled={global.state.items.length < 2}>Delete Question</button>
			</section>
			<Legend show={global.state.showLegend ? global.state.showLegend : false} legend={global.state.legend} toggle={toggleLegend}></Legend>
		</div>
	)
}

export default CreatorApp;
