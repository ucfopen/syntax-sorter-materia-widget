import React, {useContext} from 'react'
import ReactDOM from 'react-dom'
import TokenDrawer from './token-drawer'
import Token from './token'
import { store } from '../../player-store'

const PhrasePlayer = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch
	const currentCheckPref = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].checkPref : 'no'
	const currentChecksUsed = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].checksUsed : 0
	const maxChecks = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].numChecks : 0
	const currentAnswerVal = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].correct : 'none'
	const currentPhrase = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].phrase : []
	const currentFakeoutPref = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].fakeoutPref : 'no'

	const handleTokenDragOver = (event) => {

		// Exits the function if the max number of checks have been used
		if (currentCheckPref == "yes" && (currentAnswerVal == "yes" || currentChecksUsed >= maxChecks))
		{
			return
		}

		event.preventDefault()

		const cursor = event.clientX

		let leftToken = null
		let rightToken = null

		for (let i=0; i<props.sorted.length; i++) {
			let pos = props.sorted[i].position
			let left = pos.x
			let right = pos.x + pos.width

			if (cursor > left) {
				if (!leftToken || (leftToken && left > leftToken.position.x)) {
					leftToken = props.sorted[i]
					leftToken.index = i
				}
			}
			else if (cursor < right) {
				if (!rightToken || (rightToken && right < rightToken.position.x + rightToken.position.width)) {
					rightToken = props.sorted[i]
					rightToken.index = i
				}
			}
		}

		manageAdjacentTokenDisplay(leftToken, rightToken)
	}

	const handleTokenDrop = (event) => {
		event.preventDefault()
		let dropTokenName = event.dataTransfer.getData("tokenName")
		let dropTokenType = event.dataTransfer.getData("tokenType")
		let dropTokenPhraseIndex = event.dataTransfer.getData("tokenPhraseIndex")
		let dropTokenStatus = event.dataTransfer.getData("tokenStatus")
		let dropTokenFakeout = (event.dataTransfer.getData("tokenFakeout") == "true") ? true : false

		let index = 0

		for (let i = 0; i<props.sorted.length; i++) {

			if (props.sorted[i].arrangement == "left") {
				index = i + 1
			}
			else if (props.sorted[i].arrangement == "right") {
				index = i > 0 ? i : 0
			}
		}

		switch (dropTokenStatus) {
			case 'sorted':
				dispatch({
					type: 'response_token_rearrange',
					payload: {
						questionIndex: global.state.currentIndex,
						targetIndex: index,
						legend: dropTokenType,
						value: dropTokenName,
						originIndex: parseInt(dropTokenPhraseIndex),
						fakeout: dropTokenFakeout
					}
				})
				break
			case 'unsorted':
			default:
			console.log(parseInt(dropTokenPhraseIndex) + ": index")
				dispatch({
					type: 'response_token_sort',
					payload: {
						questionIndex: global.state.currentIndex,
						targetIndex: index,
						legend: dropTokenType,
						value: dropTokenName,
						phraseIndex: parseInt(dropTokenPhraseIndex),
						fakeout: dropTokenFakeout
					}
				})

				break
		}
		manageAdjacentTokenDisplay(null, null)
	}

	const manageAdjacentTokenDisplay = (left, right) => {
		dispatch({type: 'adjacent_token_update', payload: {
			questionIndex: global.state.currentIndex,
			left: left?.index,
			right: right?.index
		}})
	}

	let sortedTokens = props.sorted?.map((token, index) => {
		return <Token
			key={index}
			index={index}
			type={token.legend}
			value={token.value}
			pref={props.displayPref}
			status={token.status}
			arrangement={token.arrangement}
			position={token.position}
			fakeout={token.fakeout}>
		</Token>
	})

	return(
		<section className={`card phrase-player`
			+ ` ${(currentCheckPref == 'yes' && (currentPhrase.length == 0 || currentFakeoutPref == "yes") && currentChecksUsed == 0) ? 'pending' : ''}`
			+ ` ${(currentCheckPref == 'yes' && currentAnswerVal == 'no') ? 'incorrect' : ''}`
			+ ` ${(currentCheckPref == 'yes' && currentAnswerVal == 'yes') ? 'correct' : ''}`
			+ ` ${currentFakeoutPref == "yes" ? "fakeout" : ''}`}>
			<div className={`token-container ${currentFakeoutPref == "yes" ? "fakeout" : ''}`}>
				<div className="token-target" onDragOver={handleTokenDragOver} onDrop={handleTokenDrop}>
					{props.sorted?.length ? '' : 'Drag and drop the words below to arrange them.'}
					{sortedTokens}
				</div>
				<span className={`fakeout-tip icon-notification ${currentFakeoutPref == "yes" ? "show" : ''}`}>Not all of the items below may be part of the final phrase.</span>
			</div>
			<TokenDrawer phrase={props.phrase} displayPref={props.displayPref}></TokenDrawer>
		</section>
	)
}

export default PhrasePlayer
