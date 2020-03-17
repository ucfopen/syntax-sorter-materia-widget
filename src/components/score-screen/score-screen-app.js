import React from 'react'
import Question from './question'

const ScoreScreenApp = (props) => {

	console.log(props.scoreTable)

	const legend = props.qset.options.legend
	// console.log(legend)

	console.log(props.qset)

	const questionList = props.scoreTable.map((question, index) => {

		const correct = ! (parseInt(props.scoreTable[index].score) < 100)

		return <Question
				key={index}
				questionText={question.data[0]}
				response={question.data[1]}
				phrase={props.qset.items[index].answers[0].options.phrase}
				displayPref={props.qset.items[index].options.displayPref}
				legend={legend}
				correct={correct}></Question>
	})

	return(
		<div className='content-container'>
			{questionList}
		</div>
	)
}

export default ScoreScreenApp