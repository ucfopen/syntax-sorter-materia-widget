import React, { useReducer } from 'react'

const init = {
	title: 'New Foreign Language Widget',
	items: [],
	legend: [],
	currentIndex: 0,
	requireInit: true,
	showTutorial: true,
	showWarning: false,
	numAsk: 1,
	enableQuestionBank: "no",
	questionsAsked: []
}

const store = React.createContext(init)
const { Provider } = store
let numQuestions = 0

const shuffle = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array
}

const randTokenOrder = (reals, fakes) => {

	let merged = reals.concat(fakes)
	return shuffle(merged)
}

const importFromQset = (qset) => {
	return {
		items: qset.items.map((item) => {

			let fakes = item.options.fakes.map((token) => { return {...token, status: 'unsorted', fakeout: true}})
			let reals = item.answers[0].options.phrase.map((token) => { return {...token, status: 'unsorted', fakeout: false} })
			
			return {
				question: item.questions[0].text,
				answer: item.answers[0].text,
				hint: item.options.hint,
				fakeout: fakes,
				phrase: shuffle(reals.concat(fakes)),
				sorted: [],
				displayPref: item.options.displayPref,
				checkPref: item.options.checkPref,
				numChecks: item.options.numChecks,
				checksUsed: 0,
				responseState: 'none',
				correctPhrase: item.answers[0].options.phrase,
				qsetId: item.id
			}
		}),
		legend: qset.options.legend,
		numAsk: qset.options.numAsk,
		enableQuestionBank: qset.options.enableQuestionBank,
		questionsAsked: []
	}
}

const prepareQuestionBank = (imported) => {
	let items = imported.items
	return shuffle(items).slice(0,imported.numAsk)
}

const calcResponseState = (item) => {

	var state = 'none'
	switch (item.responseState)
	{
		case 'none':
			if (item.sorted.length > 0) {
				if (item.fakeout.length == 0) {
					state = 'pending'
				}
				else state = 'ready'
			} 
			break
			
		case 'pending':
			if (item.fakeout.length == 0 && item.phrase.length == 0) {
				state = 'ready'
			}
			break

		case 'ready':
			state = 'ready'
			break
		default:
			state = item.responseState
	}

	return {
		...item,
		responseState: state
	}
}

const tokenSortedPhraseReducer = (list, action) => {
	switch (action.type) {
		case 'token_dragging':
			return list.map((token, index) => {
				if (action.payload.tokenIndex == index) {
					return {
						...token,
						status: 'dragging'
					}
				}
				else return token
			})
		case 'token_drag_complete':
			return list.map((token, index) => {
				if (action.payload.tokenIndex == index) {
					return {
						...token,
						status: action.payload.origin
					}
				}
				else return token
			})
		case 'sorted_right_click':
			return [
				...list.slice(0, action.payload.tokenIndex),
				...list.slice(action.payload.tokenIndex + 1)
			]
		case 'token_update_position':
			return list.map((token, index) => {
				if (action.payload.tokenIndex == index) {
					return {
						...token,
						position: {
							x: action.payload.x,
							width: action.payload.width
						}
					}
				}
				else return token
			})
		case 'response_token_sort':
			return [
					...list.slice(0, action.payload.targetIndex),
					{
						legend: action.payload.legend,
						value: action.payload.value,
						status: 'sorted',
						fakeout: action.payload.fakeout,
						position: {},
						arrangement: null
					},
					...list.slice(action.payload.targetIndex)
				]
		case 'response_token_rearrange':
			let target = action.payload.targetIndex
			if (action.payload.originIndex < target) target--

			let stageOne = [
				...list.slice(0, action.payload.originIndex),
				...list.slice(action.payload.originIndex + 1)
			]

			return [
				...stageOne.slice(0, target),
				{
					legend: action.payload.legend,
					value: action.payload.value,
					status: 'sorted',
					fakeout: action.payload.fakeout,
					position: {},
					arrangement: null
				},
				...stageOne.slice(target)
			]
		case 'adjacent_token_update':
			return list.map((token) => {

				if (action.payload.left != undefined && token.index == action.payload.left) {
					return {
						...token,
						arrangement: 'left'
					}
				}
				else if (action.payload.right != undefined && token.index == action.payload.right) {
					return {
						...token,
						arrangement: 'right'
					}
				}
				else return {
					...token,
					arrangement: null
				}
			})
		default:
			throw new Error(`Sorted Token phrase reducer: action type: ${action.type} not found.`)
	}
}

const tokenUnsortedPhraseReducer = (list, action) => {
	switch (action.type) {
		case 'token_dragging':
			return list.map((token, index) => {
				if (action.payload.tokenIndex == index) {
					return {
						...token,
						status: 'dragging'
					}
				}
				else return token
			})
		case 'token_drag_complete':
			return list.map((token, index) => {
				if (action.payload.tokenIndex == index) {
					return {
						...token,
						status: action.payload.origin
					}
				}
				else return token
			})
		case 'response_token_sort':
			return [
				...list.slice(0, action.payload.phraseIndex),
				...list.slice(action.payload.phraseIndex + 1)
			]
		case 'sorted_right_click':
			return [
				...list, {
					legend: action.payload.legend,
					value: action.payload.value,
					status: 'unsorted',
					fakeout: action.payload.fakeout
				}
			]
		default:
			throw new Error(`Token phrase reducer: action type: ${action.type} not found.`)
	}
}

const questionItemReducer = (items, action) => {
	switch (action.type) {
		case 'token_dragging':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					if (action.payload.status == 'unsorted')
					{
						return { ...item, phrase: tokenUnsortedPhraseReducer(item.phrase, action) }
					}
					else if (action.payload.status == 'sorted') return {...item, sorted: tokenSortedPhraseReducer(item.sorted, action)}
				}
				else return item
			})
		case 'token_drag_complete':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					if (action.payload.origin == 'unsorted')
					{
						return { ...item, phrase: tokenUnsortedPhraseReducer(item.phrase, action) }
					}
					else if (action.payload.origin == 'sorted') return {...item, sorted: tokenSortedPhraseReducer(item.sorted, action)}
				}
				else return item
			})
		case 'sorted_right_click':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {

					return { ...item, sorted: tokenSortedPhraseReducer(item.sorted, action), phrase: tokenUnsortedPhraseReducer(item.phrase, action) }
				}
				else return item
			})
		case 'response_token_sort':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					return calcResponseState({...item, sorted: tokenSortedPhraseReducer(item.sorted, action), phrase: tokenUnsortedPhraseReducer(item.phrase, action)})
				}
				else return item
			})
		case 'response_token_rearrange':
		case 'token_update_position':
		case 'adjacent_token_update':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					return {...item, sorted: tokenSortedPhraseReducer(item.sorted, action)}
				}
				else return item
			})
		case 'attempt_submit':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					return {...item, responseState: action.payload.response, checksUsed: item.checksUsed + 1}
				}
				else return item
			})
		default:
			throw new Error(`Question item reducer: action type: ${action.type} not found.`)
	}
}

const StateProvider = ( { children } ) => {
	const [state, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case 'init':
				let qset = importFromQset(action.payload.qset)
				var items = qset.items

				if (qset.enableQuestionBank == true) {
					items = prepareQuestionBank(qset)
				}

				items.forEach((item) => {
					item.tokenOrder = randTokenOrder(item.phrase,item.fakeout)
				})

				return {...state, title: action.payload.title, items: items, legend: qset.legend, questionsAsked: items.questionsAsked, requireInit: false}
			case 'toggle_tutorial':
				return {...state, showTutorial: !state.showTutorial}
			case 'toggle_warning':
				return {...state, showWarning: !state.showWarning}
			case 'select_question':
				return {...state, currentIndex: action.payload}
			case 'paginate_question_forward':
				let forward = state.currentIndex < state.items.length -1 ? state.currentIndex + 1: state.currentIndex
				return {...state, currentIndex: forward}
			case 'token_dragging':
			case 'token_drag_complete':
			case 'sorted_right_click':
			case 'token_update_position':
			case 'response_token_sort':
			case 'response_token_rearrange':
			case 'adjacent_token_update':
			case 'attempt_submit':
				return {...state, items: questionItemReducer(state.items, action)}
			default:
				throw new Error(`Base reducer: action type: ${action.type} not found.`)
		}
	}, init)

	return <Provider value={{state, dispatch}}>{children}</Provider>
}

export {store, StateProvider }
