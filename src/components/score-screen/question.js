import React from 'react'
import Token from './token'

const Question = (props) => {

	const responseTokenList = props.response.map((token, index) => {

		let legendColor = '#f1814b'
		let value = props.displayPref == 'word' ? token.value : token.legend
		
		for (let term of props.legend) {
			if (term.name == token.legend) {
				legendColor = term.color
				break
			}
		}

		return <Token key={index} value={value} color={legendColor}></Token>
	})

	const correctList = props.phrase.map((term, index) => {

		let value = term.value
		let legendColor = '#f1814b'

		for (let legend of props.legend) {
			if (legend.id == term.legend) {
				legendColor = legend.color
				if (props.displayPref == 'legend') value = legend.name
				break
			}
		}

		return <Token key={index} value={value} color={legendColor}></Token>
	})

	return (
		<section className='card question-text-container'>
			<h3>{props.questionText.length > 0 ? props.questionText : "No question text provided."}</h3>
			<div className={`response-container ${props.score > 99 ? 'correct' : 'incorrect'}`}>
				<h5>How you responded:</h5>
				{responseTokenList}
				<span className='deduction-indicator'>{`${props.score == 100 ? 'Correct!' : 'Incorrect' }`}</span>
			</div>
			<div className='correct-container'>
				<h5>Here's the correct order:</h5>
				{correctList}
			</div>
		</section>
	)
}

export default Question
