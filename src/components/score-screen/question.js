import React from 'react'
import Token from './token'

const Question = (props) => {

	const split = props.response.split(',')	

	const responseTokenList = split.map((token, index) => {

		let legendIdOfToken = -1
		let legendColor = '#f1814b'

		if (props.displayPref == 'word') {
			for (let item of props.phrase) {
				if (item.value == token) {
					legendIdOfToken = item.legend
					break
				}
			}

			if (legendIdOfToken != -1) {
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
		}

		return <Token key={index} value={token} color={legendColor}></Token>
	})

	// console.log(responseTokenList)

	return (
		<section className='card question-container'>
			<h3>{props.questionText}</h3>
			{responseTokenList}
		</section>
	)
}

export default Question