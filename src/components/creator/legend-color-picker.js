import React from 'react'
import { ChromePicker } from 'react-color'

const LegendColorPicker = (props) => {

	// calculates viewheight units
	const vh = (v) => {
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		return (v * h) / 100;
	}

	return (
		<div className='legend-color-picker-wrapper' style={{
			top: `${Math.min(vh(50), props.offset)}px`,
			display: props.visible ? 'block' : 'none',
			left: `${-225 - 5}px`
		}}>
			<ChromePicker onChange={props.handleColorChangeComplete} color={props.color} disableAlpha={true} />
			<button onClick={props.handleClose}>Close</button>
		</div>
	)
}

export default LegendColorPicker