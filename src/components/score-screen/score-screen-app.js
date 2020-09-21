import React from 'react'
import Question from './question'

const ScoreScreenApp = (props) => {

	const legend = props.qset.options.legend

	// Sets the answer as the first question if for some reason the question id isn't valid (doesn't change score)
	const getQuestionIndex = (id) => {

		let items = props.qset.items

		for (let i = 0; i < items.length; i++)
		{
			if (items[i].id == id)
				return i
		}

		return 0
	}

	const formatResponseData = (response) => {
		let parsed = JSON.parse(response)
		let formatted = []

		for (let token of parsed) {
			formatted.push({
				value: token.value,
				legend: token.legend
			})
		}

		return formatted
	}

	const questionList = props.scoreTable.map((question, index) => {

		let questionIndex = getQuestionIndex(question.data[1])

		let responses = formatResponseData(question.data[2])

		return <Question
				index={index}
				key={index}
				questionText={question.data[0]}
				response={responses}
				phrase={props.qset.items[questionIndex].answers[0].options.phrase}
				displayPref={props.qset.items[questionIndex].options.displayPref}
				options = {props.qset.items[questionIndex].options}
				legend={legend}
				score={parseInt(props.scoreTable[index].score)}
				count={props.scoreTable.length}></Question>
	})

	return(
		<div className='content-container'>
			{questionList}
		</div>
	)
}

export default ScoreScreenApp
