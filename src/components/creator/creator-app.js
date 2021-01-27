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

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const init = () => {

		if (props.newWidget) {
			dispatch({ type: 'init-new' })
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
		if (manager.state.requireInit) {
			init()
		}
	})

	// Used to validate the data before saving.
	const validateData = () => {
		let invalid = []

		manager.state.items.forEach((item, index) => {
			// Test to make sure a phrase has atleast one token
			if (item.phrase.length <= 0) invalid.push(`Question ${index + 1} needs at least one phrase token.`)

			item.phrase.forEach((token) => {
				if (token.legend == null) invalid.push(`Question ${index + 1} phrase token "${token.value}" is missing a legend type selection.`)
			})

			item.fakes.forEach((fake) => {
				if (fake.legend == null) invalid.push(`Question ${index + 1} has a fake token "${fake.value}" without a legend type selection.`)
			})
		})

		var blankLegendCount = 0
		var duplicates = []

		manager.state.legend.forEach((term, index) => {
			// make sure a legend value isn't blank
			if (!term.name.length) {
				blankLegendCount++
			}
			else {
				// check for duplicate legend values
				manager.state.legend.forEach((otherTerm, otherIndex) => {
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
		if (invalid.length > 0) {
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
			items: manager.state.items.map((item) => {
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
				legend: manager.state.legend,
				enableQuestionBank: manager.state.enableQuestionBank,
				numAsk: manager.state.numAsk
			}
		}

		Materia.CreatorCore.save(manager.state.title, qset, 1)
	}

	// concats phrase into text string (for qset export)
	const concatPhrase = (phrase) => {
		let str = ''
		for (let i = 0; i < phrase.length; i++) {
			str += phrase[i].value + ','
		}
		return str.substring(0, str.length - 1)
	}

	props.callbacks.onSaveComplete = () => {
		console.log("OK!")
	}

	const handleTitleUpdate = (event) => {
		dispatch({ type: 'update_title', payload: event.target.value })
	}

	const handleDeleteQuestion = () => {
		dispatch({ type: 'remove_question', payload: manager.state.currentIndex })
	}

	const toggleLegend = () => {
		dispatch({ type: 'toggle_legend', payload: {} })
	}

	const toggleBank = () => {
		dispatch({ type: 'toggle_bank_modal', payload: {} })
	}

	const toggleHintModal = () => {
		dispatch({ type: 'toggle_hint_modal' })
	}

	const toggleFakeoutModal = () => {
		dispatch({ type: 'toggle_fakeout_modal' })
	}

	return (
		<div className="creator-container">
			<div className={`startupTooltip ${manager.state.onboarding ? 'show' : ''}`} onClick={toggleLegend}>
				Open the Legend to start defining individual labels for phrase tokens.
			</div>
			<CreatorTutorial></CreatorTutorial>
			<CreatorHintsModal
				attempts={manager.state.items[manager.state.currentIndex].attempts}
				hint={manager.state.items[manager.state.currentIndex].hint}></CreatorHintsModal>
			<CreatorBankModal
				enableQuestionBank={manager.state.enableQuestionBank}
				numAsk={manager.state.numAsk}
				questionCount={manager.state.items.length}></CreatorBankModal>
			<CreatorFakeoutModal
				fakes={manager.state.items[manager.state.currentIndex].fakes}></CreatorFakeoutModal>

			<CreatorErrorModal></CreatorErrorModal>
			<header className="creator-header">
				<input value={manager.state.title} onChange={handleTitleUpdate} placeholder="Give Your Widget a Title" />
				<button className="toggleLegend" onClick={toggleLegend}>Legend</button>
				<button className="toggleBank" onClick={toggleBank}>Question Bank</button>
			</header>
			<QuestionSelect questions={manager.state.items}></QuestionSelect>
			<section className="content-container">
				<Question></Question>
				<PhraseBuilder
					phrase={manager.state.items[manager.state.currentIndex].phrase}
					legend={manager.state.legend}
					showTokenTutorial={manager.state.showTokenTutorial}
					toggleLegend={toggleLegend}
					format="phrase">
				</PhraseBuilder>
				<PrefSelect
					displayPref={manager.state.items[manager.state.currentIndex].displayPref}
					fakes={manager.state.items[manager.state.currentIndex].fakes}
					attempts={manager.state.items[manager.state.currentIndex].attempts}
					hint={manager.state.items[manager.state.currentIndex].hint}></PrefSelect>
				<section className="options-container">
					<button className="card options-button" onClick={toggleHintModal}>
						<header>Edit Attempts and Hint</header>
						<span className={`button-context ${manager.state.items[manager.state.currentIndex].attempts > 1 ? "show" : ""}`}>
							Attempts: {manager.state.items[manager.state.currentIndex].attempts}, Hint: {manager.state.items[manager.state.currentIndex].hint?.length > 0 ? "Enabled" : "No Hint"}
						</span>
					</button>
					<button className="card options-button" onClick={toggleFakeoutModal}>
						<header>Edit "Fake" Tokens</header>
						<span className={`button-context ${manager.state.items[manager.state.currentIndex].fakes.length > 0 ? "show" : ""}`}>
							Fake Tokens: {manager.state.items[manager.state.currentIndex].fakes?.length}
						</span>
					</button>
					<button className="card delete-question" onClick={handleDeleteQuestion} disabled={manager.state.items.length < 2}>Delete Question</button>
				</section>
			</section>
			<Legend show={manager.state.showLegend ? manager.state.showLegend : false} legend={manager.state.legend} toggle={toggleLegend}></Legend>
		</div>
	)
}

export default CreatorApp;
