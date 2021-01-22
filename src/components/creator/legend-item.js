import React, { useContext, useRef, useEffect } from 'react'
import LegendColorPicker from './legend-color-picker'
import { store } from '../../creator-store'

const LegendItem = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const legendItemRef = useRef(null)
	const currentColor = global.state.legend[props.index].color

	const inputRef = useRef(null)

	useEffect(() => {
		if (props.focus && inputRef.current) {
			inputRef.current.focus()
		}
	}, [props.focus])

	const handleColorPickerClick = (event) => {
		let heightOffset = legendItemRef.current.getBoundingClientRect().y
		props.toggleColorPicker(props.index, heightOffset)
	}

	// QoL function to treat hitting enter in a legend item input as a shortcut to "Add New Item"
	const handleKeyDown = (event) => {
		if (event.which == 13) {
			props.addLegendItem()
		}
		else return
	}

	const onNameChange = (event) => {
		dispatch({ type: 'update_legend_item', payload: { index: props.index, text: event.target.value } })
	}

	const remove = () => {
		dispatch({ type: 'remove_legend_item', payload: { index: props.index, id: props.id } })
	}

	return (
		<div className={`legend-item ${global.state.legendColorPickerTarget == props.index ? 'selected' : ''}`} ref={legendItemRef}>
			<button className={`item-color ${global.state.legendColorPickerTarget == props.index ? 'selected' : ''}`} style={{ backgroundColor: currentColor }} onClick={handleColorPickerClick}></button>
			<input value={props.name} onChange={onNameChange} placeholder='Legend Value' ref={inputRef} onKeyDown={handleKeyDown}></input>
			<button className="remove-item" onClick={remove}>X</button>
		</div>
	)
}

export default LegendItem
