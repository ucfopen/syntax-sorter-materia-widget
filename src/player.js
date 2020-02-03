import React from 'react';
import ReactDOM from 'react-dom';
import QuestionSelect from './components/player/question-select'
import PhrasePlayer from './components/player/phrase-player'

class PlayerApp extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			title: this.props.title,
			qset: this.props.qset,
			currentIndex: 0,
			phraseList: []
		}

		this.selectQuestion = this.selectQuestion.bind(this)
		this.manageTokenArrangement = this.manageTokenArrangement.bind(this)
		this.manageTokenReport = this.manageTokenReport.bind(this)
		this.manageAdjacentTokenDisplay = this.manageAdjacentTokenDisplay.bind(this)
	}

	componentDidMount() {
		let list = []
		for (let i = 0; i< this.state.qset.items.length; i++) {
			list.push({
				index: i,
				phrase: this.state.qset.items[i].answers[0].options.phrase.slice(),
				sorted: []
			})

			for (let j = 0; j< list[i].phrase.length; j++) {
				list[i].phrase[j].status = "unsorted"
			}
		}

		this.setState({phraseList: list})
	}

	selectQuestion(index) {
		this.setState({currentIndex: index})
	}

	manageTokenArrangement(questionIndex, index, action, token) {
		// questionIndex: index of question to manage
		// index: index of phrase array to target
		// action: add, remove, or swap
		// token: the token to add

		let phraseIndex = token.phraseIndex
		delete token.phraseIndex

		this.setState((state,props) => {
			const list = state.phraseList.slice()
			list[state.currentIndex].sorted.splice(index, 0,
				{
					legend: token.legend,
					value: token.value,
					status: "sorted",
					position: {},
					arrangement: null
				})
			return {phraseList: list}
		})

		this.setState((state,props) => {
			const list = state.phraseList.slice()
			list[state.currentIndex].phrase[phraseIndex].status = "relocated"
			return {phraseList: list}
		})
	}

	manageAdjacentTokenDisplay(left, right) {

		this.setState((state, props) => {
			let list = state.phraseList.slice()
			for (let i=0; i < list[this.state.currentIndex].sorted.length; i++) {
				if (left && i == left.index) {
					list[this.state.currentIndex].sorted[i].arrangement = "left"
				}
				else if (right && i == right.index) {
					list[this.state.currentIndex].sorted[i].arrangement = "right"
				}
				else list[this.state.currentIndex].sorted[i].arrangement = null
			}
			return {phraseList : list}
		})		
	}

	manageTokenReport(report) {
		if (report.type == "token-sorted") {
			this.setState((state, props) => {
				let list = state.phraseList.slice()
				// list[state.currentIndex].sorted[report.index].status = "done-sorted"
				list[state.currentIndex].sorted[report.index].position = {
					x: report.x,
					width: report.width
				}
				return {phraseList: list}
			})
		}
	}

	render() {
		return(
			<div className="player-container">
				<header className="player-header">{this.state.title}</header>
			
				<QuestionSelect 
					currentIndex={this.state.currentIndex}
					questions={this.state.qset.items}
					selectQuestion={this.selectQuestion}></QuestionSelect>
				<section className="content-container">
					<section className="question-container">
						<p>{this.state.qset.items[this.state.currentIndex].questions[0].text}</p>
					</section>
					<PhrasePlayer
					phraseList={this.state.phraseList}
					legend={this.state.qset.options.legend}
					currentIndex={this.state.currentIndex}
					manageTokenArrangement={this.manageTokenArrangement}
					manageAdjacentTokenDisplay={this.manageAdjacentTokenDisplay}
					manageTokenReport={this.manageTokenReport}></PhrasePlayer>
				</section>
				
			</div>
		)
	}
}

PlayerApp.defaultProps = {
	title: `New Foreign Language Widget`,
	qset: {
		items: [{
			questions: [{text:'Question 1'}],
			answers: [{text:'J\'aime les chats noirs', options: {
				phrase: [
					{
						value: 'J\'',
						legend: 'pronoun'
					},
					{
						value: 'aime',
						legend: 'verb'
					},
					{
						value: 'les',
						legend: 'article'
					},
					{
						value: 'chats',
						legend: 'noun'
					},
					{
						value: 'noirs',
						legend: 'adjective'
					}
				]
			}}],
			options: {}
		},
		{
			questions: [{text:'Question 2'}],
			answers: [{text:'bibliothèque', options: {
				phrase: [
					{
						value: 'où',
						legend: 'adverb'
					},
					{
						value: 'est',
						legend: 'verb'
					},
					{
						value: 'la',
						legend: 'article'
					},
					{
						value: 'bibliothèque',
						legend: 'noun'
					}
				]
			}}],
			options: {}
		}],
		options: {
			legend: [
				{
					color: '#FF0000',
					name: 'Noun'
				},
				{
					color: '#0000FF',
					name: 'Adverb'
				},
				{
					color: '#ffd900',
					name: 'Verb'
				},
				{
					color: '#6200ff',
					name: 'Adjective'
				},
				{
					color: '#00fff2',
					name: 'Article'
				},
				{
					color: '#ff0080',
					name: 'Pronoun'
				}
			]
		}
	}
}

export default PlayerApp;

Materia.Engine.start({
	start: (instance, qset) => {
		ReactDOM.render(
			<PlayerApp />,
			document.getElementById(`root`)
		)
	}
})