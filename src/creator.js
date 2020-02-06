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

		this.state = {
			qset: props.qset,
			title: props.title,
			currentQuestionIndex: 0,
			showLegend: false,
			selectedTokenIndex: -1
		}

		this.onSaveClicked = this.onSaveClicked.bind(this)
		this.selectQuestion = this.selectQuestion.bind(this)
		this.handleChangeQuestion = this.handleChangeQuestion.bind(this)
		this.handleAddNewQuestion = this.handleAddNewQuestion.bind(this)
		this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this)
		this.handleInputToToken = this.handleInputToToken.bind(this)
		this.handleTokenToInput = this.handleTokenToInput.bind(this)
		this.handleRequestTokenSelection = this.handleRequestTokenSelection.bind(this)
		this.handleTokenSelection = this.handleTokenSelection.bind(this)
		this.handleAddLegendItem = this.handleAddLegendItem.bind(this)
		this.handleEditLegendItem = this.handleEditLegendItem.bind(this)
		this.handleRemoveLegendItem = this.handleRemoveLegendItem.bind(this)
		this.handleToggleShowLegend = this.handleToggleShowLegend.bind(this)
		this.handleTokenDisplayPref = this.handleTokenDisplayPref.bind(this)

		

		this.legendColors = ['#00FF00', '#0000FF', '#ffd900', '#6200ff', '#00fff2', '#ff0080']
		this.colorCount = 0
	}

	onSaveClicked() {
		console.log(this.state.qset)
		Materia.CreatorCore.save(this.state.title, this.state.qset, 1)
	}

	selectQuestion(index) {
		this.setState({currentQuestionIndex: index})
	}

	handleChangeQuestion(value) {
		this.setState((state, props) => {
			let qset = state.qset
			qset.items[this.state.currentQuestionIndex].questions[0].text = value
			return {qset: qset}
		})
	}

	handleAddNewQuestion() {

		this.setState((state, props) => {
			let qset = state.qset
			qset.items = [
				...qset.items,
				{
					questions: [{
						text: ''
					}],
					answers: [{
						text: '',
						options: {
							phrase: []
						}
					}],
					options: {
						displayPref: 'word'
					}
				}
			]
			return {qset: qset}
		})

		this.selectQuestion(this.state.qset.items.length)
	}

	handleDeleteQuestion() {
		// console.log(index)
		const index = this.state.currentQuestionIndex

		this.setState((state,props) => {
			let qset = state.qset
			qset.items.splice(index,1)
			return {
				qset: qset,
				currentQuestionIndex: index > 0 ? index - 1 : 0
			}
		})
	}

	handleInputToToken(input) {
		this.setState(Object.assign(this.state.qset.items[this.state.currentQuestionIndex].answers[0].options.phrase, [
			...this.state.qset.items[this.state.currentQuestionIndex].answers[0].options.phrase,
			{
				value: input,
				legend: null
			}]))
	}

	handleTokenToInput(index) {
		let phraseCopy = this.state.qset.items[this.state.currentQuestionIndex].answers[0].options.phrase.slice()
		let spliced = phraseCopy.splice(index, 1)[0]
		this.setState(Object.assign(this.state.qset.items[this.state.currentQuestionIndex].answers[0].options, {phrase: phraseCopy}))
		return spliced.value
	}

	handleRequestTokenSelection(index) {
		if (this.state.selectedTokenIndex == index) this.setState({selectedTokenIndex: -1})
		else this.setState({selectedTokenIndex: index})
		
	}

	handleTokenSelection(selection) {
		let token = this.state.qset.items[this.state.currentQuestionIndex].answers[0].options.phrase[this.state.selectedTokenIndex]
		this.setState(Object.assign(this.state.qset.items[this.state.currentQuestionIndex].answers[0].options.phrase[this.state.selectedTokenIndex], {
			value: token.value,
			legend: selection
		}))

		this.setState({selectedTokenIndex: -1})
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
	
	handleTokenDisplayPref(event) {
		const pref = event.target.value
		this.setState((state,props) => {
			let qset = state.qset
			qset.items[this.state.currentQuestionIndex].options.displayPref = pref
			return  {qset: qset}
		})
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
					selectQuestion={this.selectQuestion}
					handleAddNewQuestion={this.handleAddNewQuestion}></QuestionSelect>
				<section className="content-container">
					<Question
						currentIndex={this.state.currentQuestionIndex}
						qset={this.state.qset}
						value={this.state.qset.items[this.state.currentQuestionIndex].questions[0].text}
						handleChangeQuestion={this.handleChangeQuestion}></Question>
					<PhraseBuilder
						currentIndex={this.state.currentQuestionIndex}
						qset={this.state.qset}
						phrase={this.state.qset.items[this.state.currentQuestionIndex].answers[0].options.phrase}
						selectedTokenIndex={this.state.selectedTokenIndex}
						handleInputToToken={this.handleInputToToken}
						handleTokenToInput={this.handleTokenToInput}
						handleRequestTokenSelection={this.handleRequestTokenSelection}
						handleTokenSelection={this.handleTokenSelection}
						legend={this.state.qset.options.legend}></PhraseBuilder>
					<div className="card additional-options">
						<header>How should each token be displayed to students?</header>
						<span className="pref-select">
							<input type="radio" name="token-display-select" value={"word"} onChange={this.handleTokenDisplayPref} checked={this.state.qset.items[this.state.currentQuestionIndex].options.displayPref == 'word'}/>
							<span className={`radio-overlay ${this.state.qset.items[this.state.currentQuestionIndex].options.displayPref == 'word' ? 'selected' : ''}`}></span>
							Word
						</span>
						<span className="pref-select">
							<input type="radio" name="token-display-select" value={"part-of-speech"} onChange={this.handleTokenDisplayPref} checked={this.state.qset.items[this.state.currentQuestionIndex].options.displayPref == 'part-of-speech'}/>
							<span className={`radio-overlay ${this.state.qset.items[this.state.currentQuestionIndex].options.displayPref == 'part-of-speech' ? 'selected' : ''}`}></span>
							Part of Speech
						</span>
					</div>
					<button className="card delete-question" onClick={this.handleDeleteQuestion} disabled={this.state.qset.items.length < 2}>Delete Question</button>
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
				displayPref: 'word'
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

export default CreatorApp;

materiaCallbacks.initNewWidget = (instance) => {
	materiaCallbacks.initExistingWidget(`New Foreign Language Widget`, instance, undefined, 1, true);
}

materiaCallbacks.initExistingWidget = (title, instance, _qset, version, newWidget = false) => {
	creatorInstance = ReactDOM.render(
		<CreatorApp title={title} qset={_qset} />,
		document.getElementById(`root`)
	)
}

materiaCallbacks.onSaveClicked = () => {
	creatorInstance.onSaveClicked();
};

materiaCallbacks.onSaveComplete = () => true

Materia.CreatorCore.start(materiaCallbacks);