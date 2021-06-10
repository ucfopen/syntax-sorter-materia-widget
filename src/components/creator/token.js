import React, { useContext, useState } from 'react'
import { store } from '../../creator-store'

const Token = (props) => {
	const [hovering, setHovering] = useState(false)
	const manager = useContext(store)
	const dispatch = manager.dispatch

	let index = props.context == "fakeout" ? manager.state?.selectedFakeoutIndex : manager.state.selectedTokenIndex

	const getLegendColor = (id) => {
		if (!id) return '#ffffff'

		for (const term of manager.state.legend) {
			if (term.id == id) return term.color
		}
	}

	const toggleTokenSelection = () => {
		if (props.context == "fakeout") {
			dispatch({ type: 'toggle_fakeout_select', payload: props.index })
		}
		else {
			dispatch({ type: 'toggle_token_select', payload: props.index })
		}
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

	const deleteToken = () => {
		dispatch({
			type: 'remove_token', payload: {
				questionIndex: manager.state.currentIndex,
				phraseIndex: props.index,
				fakeoutIndex: props.index,
				context: props.context
			}
		})
	}

	let tokenColor = getLegendColor(props.type)

	return (
		<div className='token-mask'
			onMouseEnter={() => { setHovering(true) }}
			onMouseLeave={() => { setHovering(false) }}>
			<span className={`token ${!props.type ? "unassigned" : ""} ${index == props.index ? "selected" : ""}`}
				style={{
					background: tokenColor,
					color: contrastCalc(tokenColor) > 160 ? '#000000' : '#ffffff'
				}}
				onClick={toggleTokenSelection}>
				{decodeURIComponent(props.value)}
			</span>
			<div className={`close-btn ${hovering ? 'active' : ''}`}
				onClick={deleteToken}>
				<div>x</div>
			</div>
		</div>
	)
}

export default Token
