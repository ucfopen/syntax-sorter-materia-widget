import React, { useState, useContext, useRef, useEffect } from 'react'
import { store } from '../../player-store'

const Token = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const tokenRef = useRef(null)
	const isMounted = useRef(false)
	const coords = tokenRef.current?.getBoundingClientRect()

	const [isSubmit, setSubmit] = useState(false)
	const [isTokenDrawer, setTokenDrawer] = useState(true)
	const [state, setState] = useState({ dragging: false, origin: null })

	useEffect(() => {
		if (isMounted.current) {
			switch (isTokenDrawer) {
				case true:
					keyboardConfirmToken()
					break

				case false:
					keyboardRemoveToken()
					break
			}
		}
	}, [isSubmit])

	useEffect(() => {
		/* when it takes effect for the first render the value has to be negative
		until the effect of [ isSubmit ] finish rendering */
		isMounted.current = true
		if (isMounted.current) {
			dispatch({
				type: 'add_token_to_list_ref', payload: {
					tokenRef: tokenRef.current,
				}
			})
		}

		return () => {
			isMounted.current = false
			dispatch({
				type: 'remove_token_to_list_ref', payload: {
					tokenRef: tokenRef.current,
				}
			})
		}
	}, [])

	// update token position when element's x value changes
	useEffect(() => {
		if (props.status == 'sorted' && coords && coords.x > 0) {
			dispatch({
				type: 'token_update_position', payload: {
					questionIndex: manager.state.currentIndex,
					tokenIndex: props.index,
					x: coords.x,
					y: coords.y + coords.height / 2,
					width: coords.width
				}
			})
		}
	}, [coords?.x])

	/*
		// the above hook works MOST of the time, but certain events (token rearrange) clear this token's position information in the store, and the hook doesn't fire
		// manually update the position in cases where the position value does not get updated after being cleared
		useEffect( () => {
			if (props.status == 'sorted' && !props.position.x && coords) {
				dispatch({type:'token_update_position',payload: {
					questionIndex: manager.state.currentIndex,
					tokenIndex: props.index,
					x: coords.x,
					y: coords.y + coords.height/2,
					width: coords.width
				}})

				props.forceClearAdjacentTokens()
			}
		}, [props.position])
	*/

	// a token was sorted or rearranged, prompting the reqPositionUpdate flag to update for all sorted tokens. This forces them to update their position information
	// in scenarios where it wouldn't otherwise get updated
	useEffect(() => {
		if (props.status == 'sorted' && props.reqPositionUpdate == true && coords) {
			dispatch({
				type: 'token_update_position', payload: {
					questionIndex: manager.state.currentIndex,
					tokenIndex: props.index,
					x: coords.x,
					y: coords.y + coords.height / 2,
					width: coords.width
				}
			})

			props.forceClearAdjacentTokens()
		}
	}, [props?.reqPositionUpdate])

	const keyboardConfirmToken = () => {
		let currentTokenIndex = props.index
		let phraseUpdate = manager.state.items[manager.state.currentIndex].phrase[currentTokenIndex]

		dispatch({
			type: 'response_token_sort', payload: {
				questionIndex: manager.state.currentIndex,
				targetIndex: manager.state.items[manager.state.currentIndex].sorted.length, // set to this so it places the token right end of the token.
				phraseIndex: currentTokenIndex,
				id: phraseUpdate.id,
				legend: phraseUpdate.legend,
				value: phraseUpdate.value,
				fakeout: phraseUpdate.fakeout,
			}
		})

	} // End of keyboardConfirmToken()

	const keyboardRemoveToken = () => {
		const currentIndex = manager.state.currentIndex
		let question = manager.state.items[currentIndex]
		if (question?.attempts >= 1 && (question?.attemptsUsed >= question?.attempts)) { return false }
		if (question.sorted.length === 0) { return }

		const currentTokenIndex = props.index
		const sortedRemoving = question.sorted[currentTokenIndex]

		dispatch({
			type: 'sorted_token_unsort', payload: {
				origin: 'sorted',
				tokenIndex: currentTokenIndex,
				questionIndex: manager.state.currentIndex,
				fakeout: sortedRemoving.fakeout,
				legend: sortedRemoving.legend,
				value: sortedRemoving.value,
				id: sortedRemoving.id
			}
		})
	}

	const getLegendColor = (type) => {
		for (const term of manager.state.legend) {
			if (type == term.id) return term.color
		}
		return '#ffffff'
	}

	const getLegendName = (type) => {
		for (const term of manager.state.legend) {
			if (type == term.id) return term.name
		}
	}

	const handleDragStart = (event) => {

		setState(state => ({ ...state, origin: props.status }))

		event.dataTransfer.dropEffect = "move"
		event.dataTransfer.setData("tokenName", props.value)
		event.dataTransfer.setData("tokenType", props.type)
		event.dataTransfer.setData("tokenPhraseIndex", props.index)
		event.dataTransfer.setData("tokenStatus", props.status)
		event.dataTransfer.setData("tokenId", props.id)

		setTimeout(() => {
			setState(state => ({ ...state, dragging: true }))
		})

		dispatch({
			type: 'token_dragging', payload: {
				questionIndex: manager.state.currentIndex,
				tokenIndex: props.index,
				status: props.status
			}
		})
	}

	// likely unneeded
	const handleDrag = (event) => {
	}

	const handleClick = (event) => {

		// Gets the right click
		if (event.nativeEvent.which === 3) {
			event.preventDefault();

			if (!props.dragEligible) return

			if (props.status == "sorted") {
				dispatch({
					type: 'sorted_token_unsort', payload: {
						origin: state.origin,
						tokenIndex: props.index,
						questionIndex: manager.state.currentIndex,
						fakeout: props.fakeout,
						legend: props.type,
						value: props.value,
						id: props.id
					}
				})
			}
		}
	}

	const handleDragEnd = (event) => {
		dispatch({
			type: 'token_drag_complete', payload: {
				origin: state.origin,
				status: props.status,
				tokenIndex: props.index,
				questionIndex: manager.state.currentIndex,
				fakeout: props.fakeout,
				id: props.id
			}
		})

		setTimeout(() => {
			setState(state => ({ ...state, dragging: false }))
		})
	}

	// function that returns a value 0-255 based on the "lightness" of a given hex value
	const contrastCalc = (color) => {
		var r, g, b
		var m = color.substr(1).match(color.length == 7 ? /(\S{2})/g : /(\S{1})/g)
		if (m) {
			r = parseInt(m[0], 16)
			g = parseInt(m[1], 16)
			b = parseInt(m[2], 16)
		}
		if (typeof r != "undefined") return ((r * 299) + (g * 587) + (b * 114)) / 1000;
	}

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			if (isMounted.current) {
				setTokenDrawer(event.currentTarget.parentNode.className.includes('token-drawer'))
				setSubmit(!isSubmit)
			}
		}
	}

	let tokenColor = getLegendColor(props.type)
	let tokenTextDisplay = props.pref == 'word' ? props.value : getLegendName(props.type)
	let tokenLegendText = manager.state.legend[props.type]?.name

	return <div
		className={`token ${state.dragging ? 'dragging' : ''}${props.arrangement == 'left' ? 'is-left' : ''}${props.arrangement == 'right' ? 'is-right' : ''}`}
		style={{
			background: tokenColor,
			color: contrastCalc(tokenColor) > 160 ? '#000000' : '#ffffff',
			display: props.status == "relocated" ? "none" : "inline-block"
		}}
		ref={tokenRef}
		draggable={props.dragEligible}
		onDragStart={handleDragStart}
		onDrag={handleDrag}
		onDragEnd={handleDragEnd}
		onContextMenu={handleClick}
		onKeyDown={handleKeyDown}
		role={'tab'}
		tabIndex={0}
		aria-label={`Token ${tokenTextDisplay} and it is a ${tokenLegendText}`}
	>
		{tokenTextDisplay}
	</div>
}

export default Token