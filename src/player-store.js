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
	askLimit: "no",
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
	let tLen = reals.length + fakes.length
	let tArr = reals.concat(fakes)
	let indxArr = []
	let orderArr = []

	for (let i = 0; i < tLen; i++)
	{
		indxArr.push(i)
	}

	for (let i = 0; i < tLen; i++)
	{
		let rand = Math.floor(Math.random() * indxArr.length);

		if (indxArr[rand] != undefined)
		{
			orderArr.push(indxArr[rand])
			indxArr.splice(rand, 1)
		}
	}

	return orderArr
}

const importFromQset = (qset) => {
	return {
		items: qset.items.map((item) => {
			let fakes = item.options.fakeout ? shuffle(item.options.fakeout.map((token) => { return {...token, status: 'unsorted', fakeout: true}})) : []
			let reals = shuffle(item.answers[0].options.phrase.map((token) => { return {...token, status: 'unsorted', fakeout: false} }))
			return {
				question: item.questions[0].text,
				answer: item.answers[0].text,
				hint: item.options.hint,
				fakeout: fakes,
				phrase: reals,
				sorted: [],
				displayPref: item.options.displayPref,
				checkPref: item.options.checkPref,
				numChecks: item.options.numChecks,
				fakeoutPref: item.options.fakeoutPref,
				checksUsed: 0,
				correct: "none",
				correctPhrase: item.answers[0].options.phrase,
				allFakes: fakes,
				allReals: reals,
				tokenOrder: [],
				qsetId: item.id
			}
		}),
		legend: qset.options.legend,
		numAsk: qset.options.numAsk,
		askLimit: qset.options.askLimit,
		questionsAsked: []
	}
}

const reduceNumAsk = (imported) => {

	let items = imported.items

	if (imported.askLimit == "yes")
	{
		let cloneImported = JSON.parse(JSON.stringify(imported)) // Makes a deep copy
		let newItems = []
		let indxArr = []

		// Initalizes the index array
		for (let i = 0; i < items.length; i++)
		{
			indxArr.push(i)
		}

		// Gets the random questions to ask
		for (let i = 0; i < imported.numAsk; i++)
		{
			let rand = Math.floor(Math.random() * indxArr.length); // [0 - length-1]

			if (items[rand])
			{
				cloneImported.questionsAsked.push(indxArr[rand])
				newItems.push(items[indxArr[rand]])
				indxArr.splice(rand,1) // Gets rid of 1 number at the rand index
			}
			else
			{
				i--
				continue
			}
		}

		cloneImported.items = newItems

		return cloneImported
	}
	else
	{
		return imported
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
						if (action.payload.fakeout == true)
						{
							return { ...item, fakeout: tokenUnsortedPhraseReducer(item.fakeout, action) }
						}
						else
						{
							return { ...item, phrase: tokenUnsortedPhraseReducer(item.phrase, action) }
						}
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
						if (action.payload.fakeout == true)
						{
							return { ...item, fakeout: tokenUnsortedPhraseReducer(item.fakeout, action) }
						}
						else
						{
							return { ...item, phrase: tokenUnsortedPhraseReducer(item.phrase, action) }
						}
					}
					else if (action.payload.origin == 'sorted') return {...item, sorted: tokenSortedPhraseReducer(item.sorted, action)}
				}
				else return item
			})
		case 'sorted_right_click':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {

					if (action.payload.fakeout == true)
					{
						return { ...item, sorted: tokenSortedPhraseReducer(item.sorted, action), fakeout: tokenUnsortedPhraseReducer(item.fakeout, action) }
					}
					else
					{
						return { ...item, sorted: tokenSortedPhraseReducer(item.sorted, action), phrase: tokenUnsortedPhraseReducer(item.phrase, action) }
					}

					//else if (action.payload.origin == 'sorted') return {...item, sorted: tokenSortedPhraseReducer(item.sorted, action)}
				}
				else return item
			})
		case 'response_token_sort':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					if (action.payload.fakeout == true)
					{
						return {...item, sorted: tokenSortedPhraseReducer(item.sorted, action), fakeout: tokenUnsortedPhraseReducer(item.fakeout, action)}
					}
					else
					{
						return {...item, sorted: tokenSortedPhraseReducer(item.sorted, action), phrase: tokenUnsortedPhraseReducer(item.phrase, action)}
					}
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
		case 'correct_update':
			return items.map((item, index) => {
				if (index == action.payload.questionIndex) {
					return {...item, correct: action.payload.answer, checksUsed: (item.checksUsed + 1)}
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
				let imported = importFromQset(action.payload.qset)
				let importedReduced = reduceNumAsk(imported)
				for (let i = 0; i < importedReduced.items.length; i++)
				{
					importedReduced.items[i].tokenOrder = randTokenOrder(importedReduced.items[i].phrase, importedReduced.items[i].fakeout)
				}
				return {...state, title: action.payload.title, items: importedReduced.items, legend: imported.legend, questionsAsked: importedReduced.questionsAsked, requireInit: false}
			case 'toggle_tutorial':
				return {...state, showTutorial: !state.showTutorial}
			case 'toggle_warning':
				return {...state, showWarning: !state.showWarning}
			case 'select_question':
				return {...state, currentIndex: action.payload}
			case 'paginate_question_forward':
				//console.log('current indx: ' + state.currentIndex)
				let forward = state.currentIndex < state.items.length -1 ? state.currentIndex + 1: state.currentIndex
				return {...state, currentIndex: forward}
			case 'token_dragging':
			case 'token_drag_complete':
			case 'sorted_right_click':
			case 'token_update_position':
			case 'response_token_sort':
			case 'response_token_rearrange':
			case 'adjacent_token_update':
			case 'correct_update':
				return {...state, items: questionItemReducer(state.items, action)}
			default:
				throw new Error(`Base reducer: action type: ${action.type} not found.`)
		}
	}, init)

	return <Provider value={{state, dispatch}}>{children}</Provider>
}

export {store, StateProvider }
