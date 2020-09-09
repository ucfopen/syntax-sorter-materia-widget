import React, { useState, useContext, useRef, useEffect } from 'react'
import { store } from '../../player-store'

const Token = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const tokenRef = useRef(null)
	const coords = tokenRef.current?.getBoundingClientRect()

	const [state, setState] = useState({dragging: false, origin: null})

	// update token position when element's x value changes
	useEffect( () => {
		if (props.status == 'sorted' && coords && coords.x > 0) {
			dispatch({type:'token_update_position',payload: {
				questionIndex: global.state.currentIndex,
				tokenIndex: props.index,
				x: coords.x,
				y: coords.y + coords.height/2,
				width: coords.width
			}})
		}
	},[coords?.x])

	// the above hook works MOST of the time, but certain events (token rearrange) clear this token's position information in the store, and the hook doesn't fire
	// manually update the position in cases where the position value does not get updated after being cleared
	// useEffect( () => {
	// 	if (props.status == 'sorted' && !props.position.x && coords) {
	// 		dispatch({type:'token_update_position',payload: {
	// 			questionIndex: global.state.currentIndex,
	// 			tokenIndex: props.index,
	// 			x: coords.x,
	// 			y: coords.y + coords.height/2,
	// 			width: coords.width
	// 		}})

	// 		props.forceClearAdjacentTokens()
	// 	}
	// }, [props.position])

	// a token was sorted or rearranged, prompting the reqPositionUpdate flag to update for all sorted tokens. This forces them to update their position information
	// in scenarios where it wouldn't otherwise get updated
	useEffect( () => {
		if (props.status == 'sorted' && props.reqPositionUpdate == true && coords) {
			dispatch({type:'token_update_position',payload: {
				questionIndex: global.state.currentIndex,
				tokenIndex: props.index,
				x: coords.x,
				y: coords.y + coords.height/2,
				width: coords.width
			}})

			props.forceClearAdjacentTokens()
		}
	}, [props?.reqPositionUpdate])

	const getLegendColor = (type) => {
		for (const term of global.state.legend) {
			if (type == term.id) return term.color
		}
	}

	const getLegendName = (type) => {
		for (const term of global.state.legend) {
			if (type == term.id) return term.name
		}
	}

	const handleDragStart = (event) => {

		setState(state => ({...state,origin:props.status}))

		event.dataTransfer.dropEffect = "move"
		event.dataTransfer.setData("tokenName",props.value)
		event.dataTransfer.setData("tokenType",props.type)
		event.dataTransfer.setData("tokenPhraseIndex",props.index)
		event.dataTransfer.setData("tokenStatus",props.status)
		event.dataTransfer.setData("tokenFakeout",props.fakeout)

		setTimeout(() => {
			setState(state => ({...state,dragging: true}))
		})

		dispatch({type: 'token_dragging', payload: {
			questionIndex: global.state.currentIndex,
			tokenIndex: props.index,
			status: props.status,
			fakeout: props.fakeout
		}})
	}

	// likely unneeded
	const handleDrag = (event) => {
	}

	const handleClick = (event) => {

		// Gets the right click
		if (event.nativeEvent.which === 3) {
	  	event.preventDefault();

	  	if (!props.dragEligible) return

	  	if (props.status == "sorted")
	  	{
	  		dispatch({type: 'sorted_right_click', payload: {
					origin: state.origin,
					tokenIndex: props.index,
					questionIndex: global.state.currentIndex,
					fakeout: props.fakeout,
					legend: props.type,
					value: props.value
				}})
	  	}
	  }
	}

	const handleDragEnd = (event) => {

		dispatch({type: 'token_drag_complete', payload: {
			origin: state.origin,
			status: props.status,
			tokenIndex: props.index,
			questionIndex: global.state.currentIndex,
			fakeout: props.fakeout
		}})

		setTimeout(() => {
			setState(state => ({...state,dragging: false}))
		})
	}

	const handleDebugClick = () => {
		console.log(props)
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
		if (typeof r != "undefined") return ((r*299)+(g*587)+(b*114))/1000;
	}

	let tokenColor = getLegendColor(props.type)

	return (
		<div className={`token ${state.dragging ? 'dragging' : ''} ${props.arrangement == 'left' ? 'is-left' : ''} ${props.arrangement == 'right' ? 'is-right' : ''}`}
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
			onClick={handleDebugClick}>
			{props.pref == 'word' ? props.value : getLegendName(props.type)}
		</div>
	)
}

export default Token
