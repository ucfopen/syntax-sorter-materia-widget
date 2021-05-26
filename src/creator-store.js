
import React, { useReducer } from 'react'

let legendIdIncrement = 1

const init = {
	requireInit: true,
	currentIndex: 0,
	showTutorial: true,
	showHintModal: false,
	showFakeoutModal: false,
	showBankModal: false,
	showSubmissionSettingsModal: false,
	showErrorModal: false,
	errors: [],
	selectedTokenIndex: -1,
	selectedFakeoutIndex: -1,
	title: 'New Syntax Sorter Widget',
	items: [{
		question: '',
		phrase: [],
		displayPref: 'word',
		attempts: 1,
		hint: '',
		fakes: []
	}],
	legend: [
		{
			id: legendIdIncrement,
			color: '#FF0000',
			name: 'Part of Speech',
			focus: false
		}
	],
	numAsk: 1,
	enableQuestionBank: false,
	requireAllQuestions: true,
	showLegend: false,
	legendColorPickerTarget: -1,
	onboarding: true,
	showTokenTutorial: true
}
const store = React.createContext(init)
const { Provider } = store

// not a reducer, just takes qset data and transforms it into store format
const importFromQset = (qset) => {
	let items = qset.items.map((item) => {
		return {
			question: item.questions[0].text,
			phrase: item.answers[0].options.phrase,
			displayPref: item.options.displayPref,
			attempts: item.options.attempts,
			hint: item.options.hint,
			fakes: item.options.fakes
		}
	})

	// sets legendIdIncrement to the highest existing id the qset: prevents an item from ever receiving a duplicate legend id
	qset.options.legend.forEach((term) => {
		if (term.id > legendIdIncrement) legendIdIncrement = term.id
	})

	return {
		items: items,
		legend: qset.options.legend,
		numAsk: qset.options.numAsk,
		enableQuestionBank: qset.options.enableQuestionBank,
		requireAllQuestions: qset.options.requireAllQuestions ? qset.options.requireAllQuestions : false // this value will not exist for older qsets
	}
}

const questionItemReducer = (items, action) => {
	switch (action.type) {
		case 'add_new_question':
			return [...items, {
				question: '',
				phrase: [],
				displayPref: 'word',
				attempts: 1,
				hint: '',
				fakes: []
			}]
		case 'update_question_text':
			return items.map((item, index) => {
				if (index == action.payload.index) {
					return {
						...item,
						question: action.payload.text
					}
				}
				else return item
			})
		case 'remove_question':
			return [
				...items.slice(0, action.payload),
				...items.slice(action.payload+1)
			]
		case 'phrase_token_to_input':
		case 'phrase_input_to_token':
		case 'phrase_token_type_select':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					return {
						...item,
						phrase: phraseReducer(item.phrase, action)
					}
				}
				else return item
			})
		case 'fakeout_token_to_input':
		case 'fakeout_input_to_token':
		case 'fakeout_token_type_select':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					return {
						...item,
						fakes: fakeoutReducer(item.fakes, action)
					}
				}
				else return item
			})
		case 'update_display_pref':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					return {
						...item,
						displayPref: action.payload.pref
					}
				}
				else return item
			})
		case 'update_attempts':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					return {
						...item,
						attempts: parseInt(action.payload.pref)
					}

				}
				else return item
			})
		case 'update_hint':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					return {
						...item,
						hint: action.payload.pref
					}
				}
				else return item
			})
		case 'remove_legend_item':
			return items.map((item) => {
				return {
					...item,
					phrase: phraseReducer(item.phrase, action),
					fakes: fakeoutReducer(item.fakes, action)
				}
			})
		default:
			throw new Error('Question item reducer: this action type was not defined')
	}
}

const phraseReducer = (phrase, action) => {
	switch (action.type) {
		case 'phrase_token_to_input':
			return [
				...phrase.slice(0,action.payload.phraseIndex),
				...phrase.slice(action.payload.phraseIndex + 1)
			]
		case 'phrase_input_to_token':
			return [
				...phrase,
				{
					value: action.payload.text,
					legend: null
				}
			]
		case 'phrase_token_type_select':
			return phrase.map((token, index) => {
				if (index == action.payload.phraseIndex) {
					return {
						...token,
						legend: action.payload.selection
					}
				}
				else return token
			})
		case 'remove_legend_item':
			return phrase.map((token) => {
				if (token.legend == action.payload.id) {
					return {
						...token,
						legend: null
					}
				}
				else return token
			})
		default:
			throw new Error('Phrase item reducer: this action type was not defined')
	}
}

const fakeoutReducer = (fakes, action) => {
	switch (action.type) {
		case 'fakeout_token_to_input':
			return [
				...fakes.slice(0,action.payload.fakeoutIndex),
				...fakes.slice(action.payload.fakeoutIndex + 1)
			]
		case 'fakeout_input_to_token':
			return [
				...fakes,
				{
					value: action.payload.text,
					legend: null
				}
			]
		case 'fakeout_token_type_select':
			return fakes.map((token, index) => {
				if (index == action.payload.fakeoutIndex) {
					return {
						...token,
						legend: action.payload.selection
					}
				}
				else return token
			})
		case 'remove_legend_item':
			return fakes.map((token) => {
				if (token.legend == action.payload.id) {
					return {
						...token,
						legend: null
					}
				}
				else return token
			})
		default:
			throw new Error('Fakeout item reducer: this action type was not defined')
	}
}

const legendReducer = (legend, action) => {
	switch (action.type) {
		case 'add_legend_item':
			return [...legend, {
				id: ++legendIdIncrement,
				color: action.payload.color,
				name: action.payload.text,
				focus: true
			}]
		case 'update_legend_item':
			return legend.map((term, index) => {
				if (index == action.payload.index) {
					return {
						...term,
						name: action.payload.text,
						focus: false
					}
				}
				else return term
			})
		case 'remove_legend_item':
			return [
				...legend.slice(0, action.payload.index),
				...legend.slice(action.payload.index + 1)
			]
		case 'legend_color_picker_change':
			return legend.map((term, index) => {
				if (index == action.payload.index) {
					return {
						...term,
						color: action.payload.color
					}
				}
				else return term
			})
		default:
			throw new Error('Legend reducer: this action type was not defined')
	}
}

const StateProvider = ( { children } ) => {
	const [state, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case 'init-new':
				return {...state, requireInit: false}
			case 'init-existing':
				let imported = importFromQset(action.payload.qset)
				return {...state, title: action.payload.title, items: imported.items, legend: imported.legend, numAsk: imported.numAsk, enableQuestionBank: imported.enableQuestionBank, requireAllQuestions: imported.requireAllQuestions, requireInit: false, onboarding: false, showTokenTutorial: false}
			case 'dismiss_tutorial':
				return {...state, showTutorial: false}
			case 'toggle_token_tutorial':
				return {...state, showTokenTutorial: !state.showTokenTutorial}
			case 'update_title':
				return {...state, title: action.payload}
			case 'remove_question':
				if (state.items.length < 2) return state
				else return {...state, items: questionItemReducer(state.items, action), currentIndex: state.currentIndex == 0 ? 0 : state.currentIndex - 1, selectedTokenIndex: -1}
			case 'add_new_question':
				return {...state, items: questionItemReducer(state.items, action), currentIndex: state.items.length, selectedTokenIndex: -1}
			case 'update_question_text':
			case 'update_display_pref':
			case 'update_attempts':
			case 'update_hint':
			case 'fakeout_input_to_token':
				return {...state, items: questionItemReducer(state.items, action)}
			case 'phrase_input_to_token':
				return {...state, items: questionItemReducer(state.items, action), showTokenTutorial: false}
			case 'phrase_token_to_input':
				return {...state, items: questionItemReducer(state.items, action), selectedTokenIndex: action.payload.phraseIndex == state.selectedTokenIndex ? -1 : state.selectedTokenIndex }
			case 'fakeout_token_to_input':
				return {...state, items: questionItemReducer(state.items, action), selectedFakeoutIndex: action.payload.fakeoutIndex == state.selectedFakeoutIndex ? -1 : state.selectedFakeoutIndex }
			case 'phrase_token_type_select':
				return {...state, items: questionItemReducer(state.items, action), selectedTokenIndex: -1}
			case 'fakeout_token_type_select':
				return {...state, items: questionItemReducer(state.items, action), selectedFakeoutIndex: -1}
			case 'toggle_token_select':
				return {...state, selectedTokenIndex: action.payload != state.selectedTokenIndex ? action.payload : -1}
			case 'toggle_fakeout_select':
				return {...state, selectedFakeoutIndex: action.payload != state.selectedFakeoutIndex ? action.payload : -1}
			case 'select_question':
				return {...state, currentIndex: action.payload, selectedTokenIndex: -1}
			case 'toggle_legend':
				return {...state, showLegend: !state.showLegend, legendColorPickerTarget: -1, onboarding: false}
			case 'add_legend_item':
				return {...state, legend: legendReducer(state.legend, action)}
			case 'update_legend_item':
				return {...state, legend: legendReducer(state.legend, action)}
			case 'remove_legend_item':
				return {...state, items: questionItemReducer(state.items, action), legend: legendReducer(state.legend, action)}
			case 'legend_color_picker_toggle':
				if (state.legendColorPickerTarget != action.payload.index) return {...state, legendColorPickerTarget: action.payload.index}
				else return {...state, legendColorPickerTarget: -1}
			case 'legend_color_picker_change':
				return {...state, legend: legendReducer(state.legend, action)}
			case 'toggle_hint_modal':
				return {...state, showHintModal: !state.showHintModal}
			case 'toggle_fakeout_modal':
				return {...state, showFakeoutModal: !state.showFakeoutModal}
			case 'toggle_bank_modal':
				return {...state, showBankModal: !state.showBankModal}
			case 'toggle_submission_settings_modal':
				return {...state, showSubmissionSettingsModal: !state.showSubmissionSettingsModal}
			case 'toggle_error_modal':
				return {...state, errors: action.payload.error, showErrorModal: !state.showErrorModal}
			case 'update_num_ask':
				return {...state, numAsk: action.payload}
			case 'toggle_ask_limit':
				return {...state, enableQuestionBank: action.payload}
			case 'toggle_require_all_questions':
				return {...state, requireAllQuestions: action.payload}
			default:
			  throw new Error('Base reducer: this action type was not defined')
		  }
	}, init)

	return <Provider value={{state, dispatch}}>{children}</Provider>
}

export {store, StateProvider }
