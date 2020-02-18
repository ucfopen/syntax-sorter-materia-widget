
import React, { useReducer } from 'react'

const init = {
	requireInit: true,
	currentIndex: 0,
	selectedTokenIndex: -1,
	title: 'New Foreign Language Wiget',
	items: [{
		question: '',
		phrase: [],
		displayPref: 'word'
	}],
	legend: [
		{
			color: '#FF0000',
			name: 'Part of Speech'
		}
	],
	showLegend: false,
	devColorSelectIndex: 0
}
const store = React.createContext(init)
const { Provider } = store

const questionItemReducer = (items, action) => {
	switch (action.type) {
		case 'add_new_question':
			return [...items, {
				question: '',
				phrase: [],
				displayPref: 'word'
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
		default:
			throw new Error('Phrase item reducer: this action type was not defined')
	}
}

const legendReducer = (legend, action) => {
	switch (action.type) {
		case 'add_legend_item':
			return [...legend, {
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
				...legend.slice(0, action.payload),
				...legend.slice(action.payload + 1)
			]
		default:
			throw new Error('Legend reducer: this action type was not defined')
	}
}

const StateProvider = ( { children } ) => {
	const [state, dispatch] = useReducer((state, action) => {
		// console.log(state)
		console.log(action)
		switch (action.type) {
			case 'init':
				return {title: action.payload.title, items: action.payload.qset.items, legend: action.payload.qset.options.legend, requireInit: false}
			case 'update_title':
				return {...state, title: action.payload}
			case 'add_new_question':
			case 'update_question_text':
			case 'update_display_pref':
			case 'phrase_token_to_input':
			case 'phrase_input_to_token':
				return {...state, items: questionItemReducer(state.items, action)}
			case 'phrase_token_type_select':
				return {...state, items: questionItemReducer(state.items, action), selectedTokenIndex: -1}
			case 'toggle_token_select':
				return {...state, selectedTokenIndex: action.payload != state.selectedTokenIndex ? action.payload : -1}
			case 'select_question':
				return {...state, currentIndex: action.payload}
			case 'toggle_legend':
				return {...state, showLegend: !state.showLegend}
			case 'add_legend_item':
				return {...state, legend: legendReducer(state.legend, action), devColorSelectIndex: state.devColorSelectIndex+1}
			case 'update_legend_item':
			case 'remove_legend_item':
				return {...state, legend: legendReducer(state.legend, action)}
			default:
			  throw new Error('Base reducer: this action type was not defined')
		  }
	}, init)

	return <Provider value={{state, dispatch}}>{children}</Provider>
}

export {store, StateProvider }