import React, { useState, useContext, useRef, useEffect } from 'react'
import { store } from '../../player-store'

const Token = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const tokenRef = useRef(null)
	const coords = tokenRef.current?.getBoundingClientRect()

	const [state, setState] = useState({dragging: false, origin: null})

	useEffect( () => {
		if (props.status == 'sorted' && coords) {
			dispatch({type:'token_update_position',payload: {
				questionIndex: global.state.currentIndex,
				tokenIndex: props.index,
				x: coords.x,
				width: coords.width
			}})
		}
	},[coords?.x])

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

		setTimeout(() => {
			setState(state => ({...state,dragging: true}))
		})

		dispatch({type: 'token_dragging', payload: {
			questionIndex: global.state.currentIndex,
			tokenIndex: props.index,
			status: props.status
		}})
	}

	// likely unneeded
	const handleDrag = (event) => {
	}

	const handleDragEnd = (event) => {

		dispatch({type: 'token_drag_complete', payload: {
			origin: state.origin,
			status: props.status,
			tokenIndex: props.index,
			questionIndex: global.state.currentIndex
		}})

		setTimeout(() => {
			setState(state => ({...state,dragging: false}))
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
			draggable
			onDragStart={handleDragStart}
			onDrag={handleDrag}
			onDragEnd={handleDragEnd}>
			{props.pref == 'word' ? props.value : getLegendName(props.type)}
		</div>
	)
}

export default Token