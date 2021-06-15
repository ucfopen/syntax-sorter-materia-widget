import React, { useContext } from 'react'
import { store } from '../../creator-store'

const StudentPreview = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const phrase = manager.state.items[manager.state.currentIndex].phrase

	const getLegendColor = (id) => {
		if (!id) return '#ffffff'

		for (const term of manager.state.legend) {
			if (term.id == id) return term.color
		}
	}

	const getLegendName = (id) => {
		if (!id) return 'No Legend Selected'

		for (const term of manager.state.legend) {
			if (term.id == id) return term.name
		}
	}

	// function that returns a value 0-255 based on the "lightness" of a given hex value
	const contrastCalc = (color) => {
		var r, g, b
		var m = color.substr(1).match(color.length == 7 ? /(\S{2})/g : /(\S{1})/g)
		if (m) {
			r = parseInt(m[0], 16)
			g = parseInt(m[1], 16)
			b = parseInt(m[2], 16)
		}
		if (typeof r != "undefined") return ((r * 299) + (g * 587) + (b * 114)) / 1000;
	}

	const mockTokenList = phrase.map((token, index) => {
		let tokenColor = getLegendColor(token.legend)
		return <div
			className="mock-token"
			key={index}
			style={{
				background: tokenColor,
				color: contrastCalc(tokenColor) > 160 ? '#000000' : '#ffffff'
			}}>{props.displayPref == 'word' ? token.value : getLegendName(token.legend)}</div>
	})

	return (
		<div className="student-preview">
			<header>Student Preview</header>
			<div className="preview-container">
				{mockTokenList}
				<span className={`empty-message ${phrase.length > 0 ? '' : 'show'}`}>No tokens to preview yet.</span>
			</div>
		</div>
	)
}

export default StudentPreview