import React from 'react'
import { ChromePicker } from 'react-color'

const LegendColorPicker = (props) => {

	return (
		<div className='legend-color-picker-wrapper' style={{
				top: `${props.offset + 40}px`,
				display: props.visible ? 'block' : 'none'
			}}>
			<ChromePicker onChange={props.handleColorChangeComplete} color={props.color} disableAlpha={true} />
			<button onClick={props.handleClose}>Close</button>
		</div>
	)
}

export default LegendColorPicker