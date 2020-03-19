import React, { useContext, useRef } from 'react'
import LegendColorPicker from './legend-color-picker'
import { store } from '../../creator-store'

const LegendItem = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const legendItemRef = useRef(null)
	// const coords = legendItemRef.current?.getBoundingClientRect()

	// console.log(coords)

	const currentColor = global.state.legend[props.index].color

	const handleColorPickerClick = (event) => {
		let heightOffset = legendItemRef.current.getBoundingClientRect().y
		console.log(heightOffset + " heightOffset")
		props.toggleColorPicker(props.index, heightOffset)
	}	

	const onNameChange = (event) => {
		dispatch({type: 'update_legend_item', payload: {index: props.index, text: event.target.value}})
	}

	const remove = () => {
		dispatch({type: 'remove_legend_item', payload: {index: props.index, id: props.id}})
	}

	return (
		<div className="legend-item" ref={legendItemRef}>
			<button className="item-color" style={{backgroundColor: currentColor }} onClick={handleColorPickerClick}></button>
			<input value={props.name} onChange={onNameChange} placeholder='Legend Value'></input>
			<button className="remove-item" onClick={remove}>X</button>
			{/* <LegendColorPicker handleColorChangeComplete={handleColorChangeComplete} visible={global.state.legendColorPickerTarget != -1} /> */}
		</div>
	)
}

export default LegendItem