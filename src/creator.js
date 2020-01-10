import React from 'react';
import ReactDOM from 'react-dom';
import Question from './components/creator/question'
import QuestionSelect from './components/creator/question-select'
import PhraseBuilder from './components/creator/phrase-builder'
import Legend from './components/creator/legend'

const materiaCallbacks = {};
let creatorInstance;

class CreatorApp extends React.Component {
	constructor(props) {
		super(props);

		this.selectQuestion = this.selectQuestion.bind(this)
		this.handleChangeQuestion = this.handleChangeQuestion.bind(this)
		this.handleAddLegendItem = this.handleAddLegendItem.bind(this)
		this.handleEditLegendItem = this.handleEditLegendItem.bind(this)
		this.handleRemoveLegendItem = this.handleRemoveLegendItem.bind(this)
		this.handleToggleShowLegend = this.handleToggleShowLegend.bind(this)

		this.state = {
			qset: props.qset,
			title: props.title,
			currentQuestionIndex: 0,
			showLegend: false
		}

		this.legendColors = ['#00FF00', '#0000FF', '#ffd900', '#6200ff', '#00fff2', '#ff0080']
		this.colorCount = 0
	}

	selectQuestion(index) {
		this.setState({currentQuestionIndex: index})
	}

	handleChangeQuestion(value) {
		this.setState(Object.assign(this.state.qset.items[this.state.currentQuestionIndex].questions[0], {text: value}))
	}

	handleAddLegendItem() {
		this.setState(Object.assign(this.state.qset.options, {legend:  [
			...this.state.qset.options.legend,
			{
				color: this.legendColors[this.colorCount],
				name: ''
			}
		]}))
		this.colorCount++
	}

	handleEditLegendItem(index, text, color) {
		this.setState(Object.assign(this.state.qset.options.legend[index], {
			color: color,
			name: text
		}))
	}

	handleRemoveLegendItem(index) {
		let copy = this.state.qset.options.legend.slice()
		copy.splice(index, 1)
		this.setState(Object.assign(this.state.qset.options, {legend: copy}))
	}

	handleToggleShowLegend() {
		this.setState({showLegend: !this.state.showLegend})
	}

	render() {
		return(
			<div className="creator-container">
				<header className="creator-header">
					{this.state.title}
					<button className="toggleLegend" onClick={this.handleToggleShowLegend}>Legend</button>	
					<button className="debug" onClick={() => console.log(this.state.qset)}>Dump QSet</button>
				</header>
				<QuestionSelect
					currentIndex={this.state.currentQuestionIndex}
					questions={this.state.qset.items}
					selectQuestion={this.selectQuestion}></QuestionSelect>
				<section className="content-container">
					<Question
						currentIndex={this.state.currentQuestionIndex}
						qset={this.state.qset}
						value={this.state.qset.items[this.state.currentQuestionIndex].questions[0].text}
						handleChangeQuestion={this.handleChangeQuestion}></Question>
					<PhraseBuilder
						currentIndex={this.state.currentQuestionIndex}
						qset={this.state.qset}
						phrase={this.state.qset.items[this.state.currentQuestionIndex].answers[0].text}></PhraseBuilder>
				</section>
				<Legend
					items={this.state.qset.options.legend}
					handleAddLegendItem={this.handleAddLegendItem}
					handleEditLegendItem ={this.handleEditLegendItem}
					handleRemoveLegendItem={this.handleRemoveLegendItem}
					showLegend={this.state.showLegend}
					toggleShowLegend={this.handleToggleShowLegend}></Legend>
			</div>
		)
	}
}

CreatorApp.defaultProps = {
	title: `New Foreign Language Widget`,
	qset: {
		items: [{
			questions: [{text:'Question 1'}],
			answers: [{text:'This is some Answer Text One'}],
			options: {}
		},
		{
			questions: [{text:'Question 2'}],
			answers: [{text:'Here is some Answer Text Test Two'}],
			options: {}
		}],
		options: {
			legend: [
				{
					color: '#FF0000',
					name: 'Noun'
				}
			]
		}
	}
}

export default CreatorApp;

materiaCallbacks.initNewWidget = (instance) => {
	materiaCallbacks.initExistingWidget(`New Foreign Language Widget`, instance, undefined, 1, true);
}

materiaCallbacks.initExistingWidget = (title, instance, _qset, version, newWidget = false) => {
	creatorInstance = ReactDOM.render(
		<CreatorApp />,
		document.getElementById(`root`)
	)
}

Materia.CreatorCore.start(materiaCallbacks);