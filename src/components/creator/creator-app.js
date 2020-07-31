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
		let invalid = ""

		let theItems = global.state.items

		// Tests each individual question
		for (let i = 0; i < theItems.length; i++)
		{
			// Stops it running if not needed
			if (invalid.length > 0)
			{
				break
			}

			// Test to make sure there is actually an item
			if (!theItems[i])
			{
				invalid = "Missing a question item"
				break
			}

			// Test to make sure a phrase has atleast one token
			if (theItems[i].phrase.length <= 0)
			{
				invalid = `Question ${i + 1} needs at least one phrase token`
				break
			}

			// Test to make sure the guess limit is valid
			if (theItems[i].checkPref == "yes")
			{
				if (!theItems[i].numChecks || theItems[i].numChecks <= 0)
				{
					invalid = `Question ${i + 1} has an invalid number of answer checks`
					break
				}
				else if (theItems[i].numChecks > 5)
				{
					invalid = `Question ${i + 1} has too many answer checks`
					break
				}
			}

			// Test to make sure each word in each phrase has a legend
			for (let j = 0; j < theItems[i].phrase.length; j++)
			{
				// Test to make sure there is actually a phrase
				if (!theItems[i].phrase[j])
				{
					invalid = "Missing a phrase"
					break
				}

				// Test if each phrase item has an assigned legend value
				if (!theItems[i].phrase[j].legend)
				{
					invalid = `Question ${i + 1} has a phrase token that is missing a part of speech`
					break
				}
			}

			// Test to make sure if they allow fakeouts for a question that it actually has fakeouts
			if (theItems[i].fakeoutPref == "yes" && theItems[i].fakeout.length <= 0)
			{
				invalid = `Question ${i + 1} has a fakeouts enabled but has no fakeout tokens`
				break
			}

			// Test to make sure each word in each fakeout has a legend
			for (let j = 0; j < theItems[i].fakeout.length; j++)
			{

				// Test to make sure there is actually a fakeout
				if (!theItems[i].fakeout[j])
				{
					invalid = "Missing a fakeout set"
					break
				}

				// Test if each phrase item has an assigned legend value
				if (!theItems[i].fakeout[j].legend)
				{
					invalid = `Question ${i + 1} has a fakeout token that is missing a part of speech`
					break
				}
			}
		}

		// Tests if they have an invalid ask limit
		if (global.state.askLimit == "yes")
		{
			if (global.state.numAsk <= 0 || global.state.numAsk > theItems.length)
			{
				invalid = "You have entered an invalid number of questions to ask"
			}
		}

		return invalid;
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
						text: item.question,
						hint: item.hint,
						fakeout: item.fakeout
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
						checkPref: item.checkPref,
						numChecks: item.numChecks,
						fakeoutPref: item.fakeoutPref
					}
				}
			}),
			options: {
				legend: global.state.legend,
				askLimit: global.state.askLimit,
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

	const handleNumAskUpdate = (event) => {
		dispatch({type:'update_num_ask', payload: event.target.value})
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
			<CreatorTutorial></CreatorTutorial>
			<CreatorHintsModal></CreatorHintsModal>
			<CreatorFakeoutModal></CreatorFakeoutModal>
			<CreatorBankModal></CreatorBankModal>
			<CreatorErrorModal></CreatorErrorModal>
			<header className="creator-header">
				<input value={global.state.title} onChange={handleTitleUpdate}/>
				<button className="toggleLegend" onClick={toggleLegend}>Legend</button>
				<button className="toggleBank" onClick={toggleBank}>Question Bank</button>
			</header>
			 <QuestionSelect questions={global.state.items}></QuestionSelect>

			<section className="content-container">
				<Question></Question>

				<PhraseBuilder
					phrase={global.state.items[global.state.currentIndex].phrase}
					legend={global.state.legend}
					format="phrase"></PhraseBuilder>
				<PrefSelect></PrefSelect>
				<button className="card delete-question" onClick={handleDeleteQuestion} disabled={global.state.items.length < 2}>Delete Question</button>
			</section>
			<Legend show={global.state.showLegend ? global.state.showLegend : false} legend={global.state.legend} toggle={toggleLegend}></Legend>
		</div>
	)
}

export default CreatorApp;
