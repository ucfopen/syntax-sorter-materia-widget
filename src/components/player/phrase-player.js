import React, { useEffect, useContext, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import TokenDrawer from './token-drawer'
import Token from './token'
import { store, DispatchContext } from '../../player-store'

const PhrasePlayer = (props) => {

	const state = useContext(store)
	const dispatch = useContext(DispatchContext)

	const leftToken = useRef(null)
	const rightToken = useRef(null)

	const [audioImg, setAudioImg] = useState("./assets/img/volume-medium.svg")

	const handleTokenDragOver = (event) => {

		// Exits the function if the max number of guesses have been used
		if (props.attemptLimit > 1 && (props.attemptsUsed >= props.attemptLimit)) return false

		event.preventDefault()

		const cursor = event.clientX
		const cursorY = event.clientY

		let updateTokenDisplay = false
		let leftOfToken = false
		let rightOfToken = false

		// loop through each sorted token to calculate the two adjacent tokens on either side (if a token is present on that side)
		for (let i = 0; i < props.sorted.length; i++) {

			// ignore the currently dragging token
			if (props.sorted[i].status == 'dragging') continue

			let pos = props.sorted[i].position
			let left = pos.x
			let right = pos.x + pos.width
			let height = pos.y

			// cursor is within 80 px +/- of token in vertical distance
			if (cursorY > height - 80 && cursorY < height + 80) {

				// Cursor is further left than the token's midpoint
				if (cursor < (left + pos.width/2)) {

					leftOfToken = true

					// compute left-most token for adjacency, based on three conditions:
					// 1. no left-most token is currently selected
					// 2. token's left side is further left (a smaller value) than the previously selected left-most token
					// 3. previously selected left-most token's midpoint is to the LEFT of the cursor so it's too far
					if (
						!leftToken.current ||
						(leftToken.current && (left < leftToken.current.position.x)) ||
						(leftToken.current && leftToken.current.position.x + leftToken.current.position.width/2 < cursor)
					) {
						// one of the above conditions is true, only dispatch an update if the token's arrangement isn't left already
						if (props.sorted[i].arrangement != 'left') {
							
							leftToken.current = props.sorted[i]
							leftToken.current.index = i

							updateTokenDisplay = true
						}
					}
				}
				// cursor is further right than the token's midpoint
				else if (cursor > right - pos.width/2) {
					
					rightOfToken = true

					// compute right-most token for adjacency, based on three conditions:
					// 1. no right-most token is currently selected
					// 2. token's right side is further right (a larger value) than the previously selected right-most token
					// 3. previously selected right-most token's midpoint is to the RIGHT of the cursor so it's too far
					if (
						!rightToken.current ||
						(rightToken.current && (right > rightToken.current.position.x + rightToken.current.position.width)) ||
						(rightToken.current && rightToken.current.position.x + rightToken.current.position.width/2 > cursor)
					) {
						// one of the above conditions is true, only dispatch an update if the token's arrangement isn't right already
						if (props.sorted[i].arrangement != 'right') {
							
							rightToken.current = props.sorted[i]
							rightToken.current.index = i

							updateTokenDisplay = true
						}
					}
				}
			}
		}

		if (!leftOfToken) leftToken.current = null // if cursor is not left of ANY tokens, there is no token that needs an arrangement: left display; so clear it
		if (!rightOfToken) rightToken.current = null // same for right side

		// only dispatch an update to the reducer if a change has actually occurred - prevent excess updates to the store, reducing number of re-renders
		if (updateTokenDisplay) manageAdjacentTokenDisplay(leftToken.current, rightToken.current)
	}

	const handleTokenDrop = (event) => {
		event.preventDefault()
		let dropTokenId = event.dataTransfer.getData("tokenId")
		let dropTokenName = event.dataTransfer.getData("tokenName")
		let dropTokenType = event.dataTransfer.getData("tokenType")
		let dropTokenPhraseIndex = event.dataTransfer.getData("tokenPhraseIndex")
		let dropTokenStatus = event.dataTransfer.getData("tokenStatus")
		let dropTokenFakeout = (event.dataTransfer.getData("tokenFakeout") == "true") ? true : false
		let dropTokenFocus = event.dataTransfer.getData("tokenFocus")

		let index = 0

		for (let i = 0; i < props.sorted.length; i++) {

			if (props.sorted[i].id == dropTokenId) continue

			if (props.sorted[i].arrangement == "right") {
				index = i + 1
			}
			else if (props.sorted[i].arrangement == "left") {
				index = i > 0 ? i : 0
			}
		}

		switch (dropTokenStatus) {
			case 'sorted':
				dispatch({
					type: 'response_token_rearrange',
					payload: {
						questionIndex: state.currentIndex,
						targetIndex: index,
						id: dropTokenId,
						legend: dropTokenType,
						value: dropTokenName,
						originIndex: parseInt(dropTokenPhraseIndex),
						fakeout: dropTokenFakeout,
						focus: dropTokenFocus
					}
				})
				break
			case 'unsorted':
			default:
				dispatch({
					type: 'response_token_sort',
					payload: {
						questionIndex: state.currentIndex,
						targetIndex: index,
						id: dropTokenId,
						legend: dropTokenType,
						value: dropTokenName,
						phraseIndex: parseInt(dropTokenPhraseIndex),
						fakeout: dropTokenFakeout,
						focus: dropTokenFocus
					}
				})

				break
		}
		leftToken.current = null
		rightToken.current = null
		manageAdjacentTokenDisplay(null, null)
	}

	const manageAdjacentTokenDisplay = (left, right) => {
		dispatch({
			type: 'adjacent_token_update', payload: {
				questionIndex: state.currentIndex,
				left: left?.id,
				right: right?.id
			}
		})
	}

	const forceClearAdjacentTokens = () => {
		manageAdjacentTokenDisplay(null, null)
	}

	const getTokenLegendColor = (type) => {
		for (const term of state.legend) {
			if (type == term.id) return term.color
		}
		return '#ffffff'
	}

	const getTokenLegendName = (type) => {
		for (const term of state.legend) {
			if (type == term.id) return term.name
		}
		return '???'
	}

	let sortedTokens = props.sorted?.map((token, index) => {
		return <Token
			id={token.id}
			key={index}
			index={index}
			type={token.legend}
			color={getTokenLegendColor(token.legend)}
			legend={getTokenLegendName(token.legend)}
			value={token.value}
			pref={props.displayPref}
			status={token.status}
			arrangement={token.arrangement}
			position={token.position}
			reqPositionUpdate={token.reqPositionUpdate}
			fakeout={token.fakeout}
			dragEligible={!(props.attemptsUsed >= props.attemptLimit || props.responseState == 'correct')}
			forceClearAdjacentTokens={forceClearAdjacentTokens}
			focus={token.focus}>
		</Token>
	})

	let unsortedTokens = props.phrase?.map((token, index) => {
		return <Token
			id={token.id}
			key={index}
			index={index}
			type={token.legend}
			color={getTokenLegendColor(token.legend)}
			legend={getTokenLegendName(token.legend)}
			value={token.value}
			pref={props.displayPref}
			status={token.status}
			fakeout={token.fakeout}
			dragEligible={!(props.attemptsUsed >= props.attemptLimit)}
			focus={token.focus}>
		</Token>
	})

	return (
		<section className={'card phrase-player ' +
			`${props.responseState + ' '}` +
			`${props.hasFakes ? 'fakeout ' : ''}`}
			>
			<div className={`token-container ${props.hasFakes ? "fakeout" : ''}`}>
				<div className="token-target" onDragOver={handleTokenDragOver} onDrop={handleTokenDrop}>
					{props.sorted?.length ? '' : 'Drag and drop the words below to arrange them. If using a keyboard, select a token in the drawer and press Space or Enter to sort it. To rearrange a token in the sorting area, press Q to move it left and E to move it right.'}
					{sortedTokens}
				</div>
				<button id="play-audio-btn" title="Read Sorted Phrase" aria-label="Read Sorted Phrase" onClick={props.readCurrentPhrase}></button>
				<span className={`fakeout-tip ${props.hasFakes && props.phrase.length > 0 ? "show" : ''}`}>
					<span className='icon-notification'></span>Not all of the items below may be part of the correct phrase.
				</span>
			</div>
			<TokenDrawer
				tokens={unsortedTokens}
				empty={props.sorted?.length == 0}
				displayPref={props.displayPref}
				attemptsUsed={props.attemptsUsed}
				attemptLimit={props.attemptLimit}
				hasFakes={props.hasFakes}
				responseState={props.responseState}
			></TokenDrawer>
		</section>
	)
}

export default PhrasePlayer
