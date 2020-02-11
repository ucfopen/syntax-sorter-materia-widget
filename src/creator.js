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

		this.onSaveClicked = this.onSaveClicked.bind(this)
		this.handleTitleUpdate = this.handleTitleUpdate.bind(this)
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

		this.legendColors = ['#00FF00', '#0000FF', '#ffd900', '#6200ff', '#00fff2', '#ff0080'] // TODO: color picker, not hard-coded values
		this.colorCount = 0

		let qset = props.qset

		// if this is an existing qset - concat each question's phrase into the answer text string used for scoring
		if (this.props.performSetup) {
			for (let i = 0; i < qset.items.length; i++) {
				qset.items[i].answers[0].text = this.concatPhrase(qset.items[i].answers[0].options.phrase)
			}
		}

		this.state = {
			qset: qset,
			title: props.title,
			currentQuestionIndex: 0,
			showLegend: false,
			selectedTokenIndex: -1
		}
	}

	shipQset(rawQset) {

		let qset = rawQset

		for (let i = 0; i < this.state.qset.length; i++) {

			qset.items[i].id = null
			qset.items[i].materiaType = "question"
			qset.items[i].type = "language-widget"

			// concat each question's phrase into the answer text string used for scoring
			qset.items[i].answers[0].text = this.concatPhrase(qset.items[i].answers[0].options.phrase)
		}

		return qset
	}

	onSaveClicked() {
		console.log(this.state.qset)
		Materia.CreatorCore.save(this.state.title, shipQset(this.state.qset), 1)
	}

	handleTitleUpdate(event) {
		this.setState({title: event.target.value})
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

	concatPhrase(phrase) {
		let str = ''
		for (let i=0; i<phrase.length; i++) {
			str += phrase[i].value + ','
		}
		return str.substring(0,str.length-1)
	}

	handleInputToToken(input) {

		this.setState((state, props) => {
			let qset = state.qset
			qset.items[this.state.currentQuestionIndex].answers[0].options.phrase = [
				...qset.items[this.state.currentQuestionIndex].answers[0].options.phrase,
				{
					value: encodeURIComponent(input),
					legend: null
				}
			]
			
			for (let i=0;i<qset.items[this.state.currentQuestionIndex].answers[0].options.phrase.length;i++){
				qset.items[this.state.currentQuestionIndex].answers[0].text = this.concatPhrase(qset.items[this.state.currentQuestionIndex].answers[0].options.phrase)
			}

			return {qset: qset, selectedTokenIndex: -1}
		})
	}

	handleTokenToInput(index) {

		let phraseCopy = this.state.qset.items[this.state.currentQuestionIndex].answers[0].options.phrase.slice()
		let spliced = phraseCopy.splice(index, 1)[0]

		this.setState((state, props) => {
			let qset = state.qset
			qset.items[this.state.currentQuestionIndex].answers[0].options.phrase = phraseCopy

			return {qset: qset, selectedTokenIndex: -1}
		})
		return spliced.value
	}

	handleRequestTokenSelection(index) {
		if (this.state.selectedTokenIndex == index) this.setState({selectedTokenIndex: -1})
		else this.setState({selectedTokenIndex: index})
		
	}

	handleTokenSelection(selection) {
		let token = this.state.qset.items[this.state.currentQuestionIndex].answers[0].options.phrase[this.state.selectedTokenIndex]
		this.setState((state,props) => {
			let qset = state.qset
			qset.items[state.currentQuestionIndex].answers[0].options.phrase[state.selectedTokenIndex] = {
				value: token.value,
				legend: selection
			}
			return {qset: qset, selectedTokenIndex: -1}
		})
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
					<input value={this.state.title} onChange={this.handleTitleUpdate} />
					<button className="toggleLegend" onClick={this.handleToggleShowLegend}>Legend</button>
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
			questions: [{text:''}],
			answers: [{text:'', options: {
				phrase: []
			}}],
			options: {
				displayPref: 'word'
			}
		}],
		options: {
			legend: [
				{
					color: '#FF0000',
					name: 'Part of Speech'
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
		<CreatorApp title={title} qset={_qset} performSetup={ !newWidget } />,
		document.getElementById(`root`)
	)
}

materiaCallbacks.onSaveClicked = () => {
	creatorInstance.onSaveClicked();
};

materiaCallbacks.onSaveComplete = () => true

Materia.CreatorCore.start(materiaCallbacks);