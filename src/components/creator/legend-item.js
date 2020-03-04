import React, { useContext } from 'react'
import { store } from '../../creator-store'

const LegendItem = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const onNameChange = (event) => {
		dispatch({type: 'update_legend_item', payload: {index: props.index, text: event.target.value}})
	}

	const remove = () => {
		dispatch({type: 'remove_legend_item', payload: {index: props.index, id: props.id}})
	}

	return (
		<div className="legend-item">
			<div className="item-color" style={{backgroundColor: props.color }}></div>
			<input value={props.name} onChange={onNameChange} placeholder='Legend Value'></input>
			<button className="remove-item" onClick={remove}>X</button>
		</div>
	)
}

export default LegendItem