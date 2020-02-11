import React from 'react';
import Token from './token'

export default class PhraseBuilder extends React.Component {
	constructor(props) {
		super(props)

		this.handleTokenInput = this.handleTokenInput.bind(this)
		this.convertInputToToken = this.convertInputToToken.bind(this)
		this.convertTokenToInput = this.convertTokenToInput.bind(this)
		this.tokenTypeSelection = this.tokenTypeSelection.bind(this)
		this.renderLegendForSelection = this.renderLegendForSelection.bind(this)
	}

	handleTokenInput(event) {
		switch (event.which) {
			case 8: // backspace
				// convert prior token back to input
				if (event.target.value.length == 0) {
					event.preventDefault()
					let text = this.convertTokenToInput(this.props.phrase.length - 1)
					event.target.value = decodeURIComponent(text)
				}
				break;
			case 13: // enter
				// convert input to token
				this.convertInputToToken(event.target.value)
				event.target.value = ""
			default:
				return;
		}
	}

	convertPhraseToTokens(phrase) {
		const tokens = []
		
		for (let i = 0; i < phrase.length; i++) {
			tokens.push(
				<Token
					key={i}
					index={i}
					type={phrase[i].legend}
					value={phrase[i].value}
					legend={this.props.legend}
					handleRequestTokenSelection={this.props.handleRequestTokenSelection}
					handleTokenSelection={this.props.handleTokenSelection}
					selected={this.props.selectedTokenIndex == i}>
				</Token>)
		}

		return tokens
	}

	convertInputToToken(input) {
		this.props.handleInputToToken(input)
	}

	convertTokenToInput(index) {
		return this.props.handleTokenToInput(index)
	}

	renderTokens() {
		return this.convertPhraseToTokens(this.props.phrase)
	}

	renderLegendForSelection() {
		const selection = []

		for (let j = 0; j < this.props.legend.length; j++) {
			selection.push(
				<label key={j}>
					<input type="radio" name="token-type-selection" value={this.props.legend[j].name} onChange={this.tokenTypeSelection}/>
					<span className="color-radio" style={{background: this.props.legend[j].color}}></span>{this.props.legend[j].name}
				</label>)
		}
		return selection
	}
	
	tokenTypeSelection(event) {
		this.props.handleTokenSelection(event.target.value)
	}

	render() {
		return(
			<section className="card phrase-builder">
				<header>Phrase to Complete</header>
				<div className="token-container">
					{this.renderTokens()}
					<input className="token-input" onKeyDown={this.handleTokenInput} placeholder="..."></input>
				</div>
				<div className={`token-type-selector ${this.props.selectedTokenIndex != -1 ? "show" : ""}`}>
					<header>What type of word is this?</header>
					<form id="tokenTypeSelection">
						{this.renderLegendForSelection()}
					</form>
				</div>
			</section>
		)
	}	
}