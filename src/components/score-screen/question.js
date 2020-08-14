import React from 'react'
import Token from './token'

const Question = (props) => {

	const split = props.response.split(',')

	const responseTokenList = split.map((token, index) => {

		let legendIdOfToken = -1
		let legendColor = '#f1814b'
		let isFake = false

		if (props.displayPref == 'word') {
			for (let item of props.phrase) {
				if (item.value == token) {
					legendIdOfToken = item.legend
					break
				}
			}

			if (legendIdOfToken == -1 && props.options.fakeoutPref == "yes")
			{
				for (let item of props.options.fakeout) {
					if (item.value == token) {
						legendIdOfToken = item.legend
						isFake = true
						legendColor = '#c8c8c8'
						break
					}
				}
			}

			if (legendIdOfToken != -1 && isFake == false) {
				for (let term of props.legend) {
					if (term.id == legendIdOfToken) {
						legendColor = term.color
						break
					}
				}
			}
		}
		else if (props.displayPref == 'part-of-speech') {
			for (let term of props.legend) {
				if (term.name.toLowerCase() == token.toLowerCase()) {
					legendColor = term.color
					break
				}
			}

			if (props.options.fakeoutPref == "yes")
			{
				for (let term of props.legend) {
					if (term.name.toLowerCase() == token.toLowerCase()) {
						legendIdOfToken = term.id
						break
					}
				}

				for (let item of props.options.fakeout) {
					if (item.legend == legendIdOfToken) {
						isFake = true
						legendColor = '#c8c8c8'
						break
					}
				}
			}
		}

		return <Token key={index} value={token} color={legendColor} fakeout={isFake}></Token>
	})

	const correctList = props.phrase.map((term, index) => {

		let value = term.value
		let legendColor = '#f1814b'

			for (let legend of props.legend) {
				if (legend.id == term.legend) {
					legendColor = legend.color
					if (props.displayPref == 'part-of-speech') value = legend.name
					break
				}
		}


		return <Token key={index} value={value} color={legendColor}></Token>
	})

	// console.log(responseTokenList)

	return (
		<section className='card question-text-container'>
			<h3>{props.questionText}</h3>
			<div className={`response-container ${props.score > 99 ? 'correct' : 'incorrect'}`}>
				<h5>How you responded:</h5>
				{responseTokenList}
				<span className='deduction-indicator'>{`${props.score == 100 ? 'Correct!' : '- ' + (100 - props.score) / props.count + '%' }`}</span>
			</div>
			<div className='correct-container'>
				<h5>Here's the correct order:</h5>
				{correctList}
			</div>
		</section>
	)
}

export default Question
