import React from 'react'
import Question from './question'

const ScoreScreenApp = (props) => {

	//console.log(props.scoreTable)

	const legend = props.qset.options.legend
	// console.log(legend)

	//console.log(props.qset)

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

	const questionList = props.scoreTable.map((question, index) => {

		let questionIndex = getQuestionIndex(question.data[1])

		return <Question
				key={index}
				questionText={question.data[0]}
				response={question.data[2]}
				phrase={props.qset.items[questionIndex].answers[0].options.phrase}
				displayPref={props.qset.items[questionIndex].options.displayPref}
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
