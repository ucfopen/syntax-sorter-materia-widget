
import React, { useReducer } from 'react'

let legendIdIncrement = 1

const init = {
	requireInit: true,
	currentIndex: 0,
	showTutorial: true,
	showHintModal: false,
	showFakeoutModal: false,
	showBankModal: false,
	showErrorModal: false,
	errorMsg: "",
	selectedTokenIndex: -1,
	selectedFakeoutIndex: -1,
	title: 'New Foreign Language Wiget',
	items: [{
		question: '',
		phrase: [],
		displayPref: 'word',
		checkPref: 'no',
		numChecks: 1,
		hint: '',
		fakeoutPref: 'no',
		fakeout: []
	}],
	legend: [
		{
			id: legendIdIncrement,
			color: '#FF0000',
			name: 'Part of Speech'
		}
	],
	numAsk: 1,
	askLimit: "no",
	showLegend: false,
	legendColorPickerTarget: -1
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
			checkPref: item.options.checkPref,
			numChecks: item.options.numChecks,
			hint: item.options.hint,
			fakeoutPref: item.options.fakeoutPref,
			fakeout: item.options.fakeout
		}
	})

	legendIdIncrement = qset.options.legend.length

	return {
		items: items,
		legend: qset.options.legend,
		numAsk: qset.options.numAsk,
		askLimit: qset.options.askLimit
	}
}

const questionItemReducer = (items, action) => {
	switch (action.type) {
		case 'add_new_question':
			return [...items, {
				question: '',
				phrase: [],
				displayPref: 'word',
				checkPref: 'no',
				numChecks: 0,
				hint: '',
				fakeoutPref: 'no',
				fakeout: []
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
						fakeout: fakeoutReducer(item.fakeout, action)
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
		case 'update_check_pref':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					return {
						...item,
						checkPref: action.payload.pref
					}
				}
				else return item
			})
		case 'update_num_checks':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					return {
						...item,
						numChecks: parseInt(action.payload.pref)
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
		case 'update_fakeout_pref':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					return {
						...item,
						fakeoutPref: action.payload.pref
					}
				}
				else return item
			})
		case 'remove_legend_item':
			return items.map((item) => {
				return {
					...item,
					phrase: phraseReducer(item.phrase, action)
				}
			})
		case 'fakeout_remove_legend_item':
			return items.map((item) => {
				return {
					...item,
					fakeout: fakeoutReducer(item.fakeout, action)
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

const fakeoutReducer = (fakeout, action) => {
	switch (action.type) {
		case 'fakeout_token_to_input':
			return [
				...fakeout.slice(0,action.payload.fakeoutIndex),
				...fakeout.slice(action.payload.fakeoutIndex + 1)
			]
		case 'fakeout_input_to_token':
			return [
				...fakeout,
				{
					value: action.payload.text,
					legend: null
				}
			]
		case 'fakeout_token_type_select':
			return fakeout.map((token, index) => {
				if (index == action.payload.fakeoutIndex) {
					return {
						...token,
						legend: action.payload.selection
					}
				}
				else return token
			})
		case 'fakeout_remove_legend_item':
			return fakeout.map((token) => {
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

const legendReducer = (legend, action) => {
	switch (action.type) {
		case 'add_legend_item':
			return [...legend, {
				id: ++legendIdIncrement,
				color: action.payload.color,
				name: action.payload.text
			}]
		case 'update_legend_item':
			return legend.map((term, index) => {
				if (index == action.payload.index) {
					return {
						...term,
						name: action.payload.text
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
			console.log("color picker change: index: " + action.payload.index + " and color: " + action.payload.color)
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
				return {...state, title: action.payload.title, items: imported.items, legend: imported.legend, numAsk: imported.numAsk, askLimit: imported.askLimit, requireInit: false}
			case 'dismiss_tutorial':
				return {...state, showTutorial: false}
			case 'update_title':
				return {...state, title: action.payload}
			case 'remove_question':
				if (state.items.length < 2) return state
				else return {...state, items: questionItemReducer(state.items, action), currentIndex: state.currentIndex - 1}
			case 'add_new_question':
			case 'update_question_text':
			case 'update_display_pref':
			case 'update_check_pref':
			case 'update_num_checks':
			case 'update_fakeout_pref':
			case 'update_fakeout':
			case 'update_hint':
			case 'phrase_token_to_input':
			case 'phrase_input_to_token':
				return {...state, items: questionItemReducer(state.items, action)}
			case 'fakeout_token_to_input':
			case 'fakeout_input_to_token':
				return {...state, items: questionItemReducer(state.items, action)}
			case 'phrase_token_type_select':
				return {...state, items: questionItemReducer(state.items, action), selectedTokenIndex: -1}
			case 'fakeout_token_type_select':
				return {...state, items: questionItemReducer(state.items, action), selectedFakeoutIndex: -1}
			case 'toggle_token_select':
				return {...state, selectedTokenIndex: action.payload != state.selectedTokenIndex ? action.payload : -1}
			case 'toggle_fakeout_select':
				return {...state, selectedFakeoutIndex: action.payload != state.selectedFakeoutIndex ? action.payload : -1}
			case 'select_question':
				return {...state, currentIndex: action.payload}
			case 'toggle_legend':
				return {...state, showLegend: !state.showLegend}
			case 'add_legend_item':
				return {...state, legend: legendReducer(state.legend, action)}
			case 'update_legend_item':
				return {...state, legend: legendReducer(state.legend, action)}
			case 'remove_legend_item':
				return {...state, items: questionItemReducer(state.items, action), legend: legendReducer(state.legend, action)}
			case 'fakeout_remove_legend_item':
				return {...state, items: questionItemReducer(state.items, action)}
			case 'legend_color_picker_toggle':
				if (state.legendColorPickerTarget != action.payload.index) return {...state, legendColorPickerTarget: action.payload.index}
				else return {...state, legendColorPickerTarget: -1}
			case 'legend_color_picker_change':
				return {...state, legend: legendReducer(state.legend, action), legendColorPickerTarget: -1}
			case 'toggle_hint_modal':
				return {...state, showHintModal: !state.showHintModal}
			case 'toggle_fakeout_modal':
				return {...state, showFakeoutModal: !state.showFakeoutModal}
			case 'toggle_bank_modal':
				return {...state, showBankModal: !state.showBankModal}
			case 'toggle_error_modal':
				return {...state, errorMsg: action.payload.error, showErrorModal: !state.showErrorModal}
			case 'update_num_ask':
				return {...state, numAsk: action.payload}
			case 'update_ask_limit':
				return {...state, askLimit: action.payload}
			default:
			  throw new Error('Base reducer: this action type was not defined')
		  }
	}, init)

	return <Provider value={{state, dispatch}}>{children}</Provider>
}

export {store, StateProvider }
