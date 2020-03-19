import React, { useContext, useState } from 'react'
import LegendItem from './legend-item'
import { store } from '../../creator-store'
import LegendColorPicker from './legend-color-picker'

const Legend = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const colorSelectIndex = global.state.devColorSelectIndex
	const colors = ['#00FF00', '#0000FF', '#ffd900', '#6200ff', '#00fff2', '#ff0080'] // TODO: color picker, not hard-coded values

	const [state, setState] = useState({colorSelectOffset: 0})

	let colorSelectRef = global.state.legendColorPickerTarget != -1 ? global.state.legend[global.state.legendColorPickerTarget].color : '#FF0000'
	let colorSelectOffset = 0

	const toggleColorPicker = (index, offset) => {
		setState(state => ({colorSelectOffset: offset}))
		dispatch({type: 'legend_color_picker_toggle', payload: {index: index}})
	}
	
	const addLegendItem = () => {
		dispatch({type: 'add_legend_item', payload: {text: '', color: colors[colorSelectIndex]}})
	}
	
	const handleColorChangeComplete = (color, event) => {
		dispatch({type: 'legend_color_picker_change', payload: {index: global.state.legendColorPickerTarget, color: color.hex}})
	}

	let legendItems = props.legend.map((item, index) => {
		return <LegendItem key={index} name={item.name} id={item.id} index={index} toggleColorPicker={toggleColorPicker}></LegendItem>
	})

	return (
		<section className={`legend ${props.show ? "show" : ""}`}>
			<header>Legend</header>
			{legendItems}
			<button className="addNew" onClick={addLegendItem}>+ Add Another</button>
			<button className="doneBtn" onClick={props.toggle}>Done</button>
			<LegendColorPicker handleColorChangeComplete={handleColorChangeComplete} color={colorSelectRef} visible={global.state.legendColorPickerTarget != -1} offset={state.colorSelectOffset}/>
		</section>
	)	
}

export default Legend