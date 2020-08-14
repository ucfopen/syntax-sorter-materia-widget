import React from 'react'

const Token = (props) => {

	// function that returns a value 0-255 based on the "lightness" of a given hex value
	const contrastCalc = (color) => {

		if (!color) return 0

		var r, g, b
		var m = color.substr(1).match(color.length == 7 ? /(\S{2})/g : /(\S{1})/g)
		if (m) {
			r = parseInt(m[0], 16)
			g = parseInt(m[1], 16)
			b = parseInt(m[2], 16)
		}
		if (typeof r != "undefined") return ((r*299)+(g*587)+(b*114))/1000;
	}

	let textColor = (contrastCalc(props.color) > 160 ? '#000000' : '#ffffff')

	if (props.fakeout == true)
		textColor = '#656464'

	return (
		<div className='token' style={{
				background: props.color,
				color: textColor
			}}>
			{props.fakeout == true ? <del>{props.value}</del> : `${props.value}`}
		</div>
	)
}

export default Token
