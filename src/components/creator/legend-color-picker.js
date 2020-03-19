import React from 'react'
import { BlockPicker } from 'react-color'

const LegendColorPicker = (props) => {

	console.log(props.offset)

	return (
		<div className='legend-color-picker-wrapper' style={{
				top: `${props.offset + 40}px`,
				display: props.visible ? 'block' : 'none'
			}}>
			<BlockPicker onChangeComplete={props.handleColorChangeComplete} color={props.color} />
		</div>
	)
}

export default LegendColorPicker