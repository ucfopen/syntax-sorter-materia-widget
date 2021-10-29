import React, { useContext, useState } from 'react'
import LegendItem from './legend-item'
import { store } from '../../creator-store'
import LegendColorPicker from './legend-color-picker'

const Legend = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const [state, setState] = useState({ colorSelectOffset: 0 })

	let colorSelectRef = manager.state.legendColorPickerTarget != -1 ? manager.state.legend[manager.state.legendColorPickerTarget].color : '#FF0000'
	let colorSelectOffset = 0

	const toggleColorPicker = (index, offset) => {
		setState(state => ({ colorSelectOffset: offset }))
		dispatch({ type: 'legend_color_picker_toggle', payload: { index: index } })
	}

	const addLegendItem = () => {
		// generates a random hex color code
		let newRandColor = '#000000'.replace(/0/g, () => {
			return (~~(Math.random() * 16)).toString(16)
		})
		dispatch({ type: 'add_legend_item', payload: { text: '', color: newRandColor } })
	}

	const handleColorChangeComplete = (color, event) => {
		dispatch({ type: 'legend_color_picker_change', payload: { index: manager.state.legendColorPickerTarget, color: color.hex } })
	}

	const handleCloseColorPicker = (event) => {
		dispatch({ type: 'legend_color_picker_toggle', payload: { index: manager.state.legendColorPickerTarget } })
	}

	let legendItems = manager.state.legend.map((item, index) => {
		return <LegendItem key={index} index={index} toggleColorPicker={toggleColorPicker} focus={item.focus} addLegendItem={addLegendItem}></LegendItem>
	})

	return (
		<section className={`legend ${manager.state.showLegend ? "show" : ""}`}>
			<header>Legend</header>
			<p><span className="icon-notification"></span>Use the Legend to easily identify the syntax of individual tokens you create. For example, if you're
				creating a phrase in another language, you might use the Legend to identify individual parts of speech.
			</p>
			<div className="legend-item-container">
				{legendItems}
				<button className="addNew" onClick={addLegendItem}>+ Add Another</button>
			</div>
			<button className="doneBtn" onClick={props.toggle}>Done</button>
			<LegendColorPicker
				handleColorChangeComplete={handleColorChangeComplete}
				handleClose={handleCloseColorPicker}
				color={colorSelectRef}
				visible={manager.state.legendColorPickerTarget != -1}
				offset={state.colorSelectOffset} />
		</section>
	)
}

export default Legend