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

		this.shuffle = this.shuffle.bind(this)
		this.selectQuestion = this.selectQuestion.bind(this)
		this.manageTokenArrangement = this.manageTokenArrangement.bind(this)
		this.manageTokenReport = this.manageTokenReport.bind(this)
		this.manageAdjacentTokenDisplay = this.manageAdjacentTokenDisplay.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.convertSortedToString = this.convertSortedToString.bind(this)
		this.renderLegendItems = this.renderLegendItems.bind(this)
	}

	componentDidMount() {
		let list = []

		for (let i = 0; i< this.state.qset.items.length; i++) {
			list.push({
				qsetId: this.state.qset.items[i].id,
				index: i,
				phrase: this.shuffle(this.state.qset.items[i].answers[0].options.phrase.slice()),
				sorted: [],
				displayPref: this.state.qset.items[i].options.displayPref
			})

			for (let j = 0; j< list[i].phrase.length; j++) {
				list[i].phrase[j].status = "unsorted"
			}
		}

		this.setState({phraseList: list})
	}

	shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array
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

		switch (action) {
			case 'rearrange':
				this.setState((state,props) => {
					const list = state.phraseList.slice()

					if (phraseIndex < index) {
						index--
					}

					list[state.currentIndex].sorted.splice(phraseIndex, 1)

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
				break

			case 'add':
			default:
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
				break
		}
		
	}

	manageAdjacentTokenDisplay(left, right) {

		this.setState((state, props) => {
			let list = state.phraseList.slice()
			for (let i=0; i < list[this.state.currentIndex].sorted.length; i++) {

				if (list[this.state.currentIndex].sorted[i].status == 'dragging') continue

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

		switch (report.type) {
			case 'token-sorted':
				this.setState((state, props) => {
					let list = state.phraseList.slice()
					list[state.currentIndex].sorted[report.index].position = {
						x: report.x,
						width: report.width
					}
					return {phraseList: list}
				})
				break
			case 'token-drag-complete':
				if (report.status == 'dragging') {
					this.setState((state, props) => {
						let list = state.phraseList.slice()
						if (report.origin == 'unsorted' || report.origin == 'relocated') {
							list[state.currentIndex].phrase[report.index].status = report.origin
						}
						else {
							list[state.currentIndex].sorted[report.index].status = report.origin
						}
						return {phraseList: list}
					})
				}
				this.manageAdjacentTokenDisplay(null, null)
				break
			case 'token-dragging':
				this.setState((state, props) => {
					let list = state.phraseList.slice()
					if (report.status == 'unsorted') {
						list[state.currentIndex].phrase[report.index].status = 'dragging'
					}
					else {
						list[state.currentIndex].sorted[report.index].status = 'dragging'
					}
					return {phraseList: list}
				})
				break
			default: 
				return false
		}
	}

	convertSortedToString(sorted) {
		let string = ''
		for (let i=0;i<sorted.length;i++) {
			string += sorted[i].value + ','
		}
		return string.substring(0,string.length-1)
	}

	handleSubmit() {
		for (let i=0; i<this.state.phraseList.length; i++) {
			Materia.Score.submitQuestionForScoring(this.state.phraseList[i].qsetId,this.convertSortedToString(this.state.phraseList[i].sorted))
		}
		Materia.Engine.end(true)
	}

	renderLegendItems() {
		let legend = []
		for (let i=0; i<this.state.qset.options.legend.length; i++) {
			legend.push(<span key={i} className="legend-item"><span className="legend-color" style={{background: this.state.qset.options.legend[i].color}}></span>{this.state.qset.options.legend[i].name}</span>)
		}
		return legend
	}

	render() {
		return(
			<div className="player-container">
				<header className="player-header">
					{this.state.title}
					<button className="submit" onClick={this.handleSubmit}>Submit</button>
				</header>
			
				<QuestionSelect 
					currentIndex={this.state.currentIndex}
					questions={this.state.qset.items}
					selectQuestion={this.selectQuestion}></QuestionSelect>
				<section className="content-container">
					<section className="card question-container">
						<p>{this.state.qset.items[this.state.currentIndex].questions[0].text}</p>
					</section>
					<PhrasePlayer
					phraseList={this.state.phraseList}
					legend={this.state.qset.options.legend}
					currentIndex={this.state.currentIndex}
					manageTokenArrangement={this.manageTokenArrangement}
					manageAdjacentTokenDisplay={this.manageAdjacentTokenDisplay}
					manageTokenReport={this.manageTokenReport}></PhrasePlayer>
					<section className="card legend" style={{opacity: this.state.phraseList[this.state.currentIndex] && this.state.phraseList[this.state.currentIndex].displayPref == 'word' ? 1 : 0}}>
						<header>Color Legend</header>
						{this.renderLegendItems()}
					</section>
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
			options: {
				displayPref: 'word'
			}
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
			options: {
				displayPref: 'part-of-speech'
			}
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
			<PlayerApp title={instance.name} qset={qset}/>,
			document.getElementById(`root`)
		)
	}
})