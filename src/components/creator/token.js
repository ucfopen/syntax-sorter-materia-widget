import React, { useContext } from 'react'
import { store } from '../../creator-store'

const Token = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const getLegendColor = (name) => {
		if (!name) return '#ffffff'

		for (const term of global.state.legend) {
			if (term.name.toLowerCase() == name.toLowerCase()) return term.color
		}
	}

	const toggleTokenSelection = () => {
		dispatch({type: 'toggle_token_select', payload: props.index})
	}

	return (
		<span className={`token ${!props.type ? "unassigned" : ""} ${global.state.selectedTokenIndex == props.index ? "selected" : ""}`}
			style={{background: getLegendColor(props.type)}}
			onClick={toggleTokenSelection}>{decodeURIComponent(props.value)}</span>
	)
}

export default Token