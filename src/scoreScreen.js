import React from 'react'
import ReactDOM from 'react-dom'
import ScoreScreenApp from './components/score-screen/score-screen-app'

let name = ''

const renderScoreScreen = (qset, scoreTable, title=undefined) => {
	if (title !== undefined) {
		name = title;
	}

	ReactDOM.render(
		<ScoreScreenApp
			qset={qset}
			scoreTable={scoreTable}
			title={name}
		/>,
		document.getElementById(`root`)
	);
}

// Materia.ScoreCore.hideScoresOverview()
Materia.ScoreCore.hideResultsTable()

Materia.ScoreCore.start({
	start: (instance, qset, scoreTable, isPreview, qsetVersion) => {
		renderScoreScreen(qset, scoreTable, instance.name)
	},
	update: (qset, scoreTable) => {
		renderScoreScreen(qset, scoreTable)
	}
})
