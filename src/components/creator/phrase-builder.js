import React, { useContext } from 'react'
import Token from './token'
import { store } from '../../creator-store'

const PhraseBuilder = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch
	const currentLegend = manager.state.items[manager.state.currentIndex].phrase[manager.state.selectedTokenIndex] ? manager.state.items[manager.state.currentIndex].phrase[manager.state.selectedTokenIndex].legend : -1
	const phrase = manager.state.items[manager.state.currentIndex].phrase

	const MAX_TOKENS = 500
	const MAX_TOKEN_CHARS = 200

	const handleTokenInput = (event) => {
		switch (event.which) {
			case 8: // backspace
				// convert prior token back to input
				if (event.target.value.length == 0) {
					event.preventDefault()
					if (phrase.length < 1) return
					let text = convertTokenToInput(phrase.length - 1)
					event.target.value = decodeURIComponent(text)
				}
				break;
			case 13: // enter
				// convert input to token
				if (event.target.value.length > 0) {
					convertInputToToken(event.target.value)
					event.target.value = ""
				} else return

			default:
				return
		}
	}

	const convertTokenToInput = (index) => {
		let text = manager.state.items[manager.state.currentIndex].phrase[index].value
		dispatch({
			type: 'phrase_token_to_input', payload: {
				questionIndex: manager.state.currentIndex,
				phraseIndex: index
			}
		})
		return text
	}

	const convertInputToToken = (input) => {
		if (phrase.length >= MAX_TOKENS) return
		dispatch({
			type: 'phrase_input_to_token', payload: {
				questionIndex: manager.state.currentIndex,
				text: input
			}
		})
	}

	const tokenTypeSelection = (event) => {
		let selection = parseInt(event.target.value)
		dispatch({
			type: 'phrase_token_type_select', payload: {
				questionIndex: manager.state.currentIndex,
				phraseIndex: manager.state.selectedTokenIndex,
				selection: selection
			}
		})
	}

	const toggleTokenTutorial = (event) => {
		dispatch({
			type: 'toggle_token_tutorial', payload: {
				toggle: !manager.state.showTokenTutorial
			}
		})
	}

	let tokenList = phrase.map((term, index) => {
		return <Token key={index} index={index} type={term.legend} value={term.value} context="phrase"></Token>
	})

	let legendSelection = manager.state.legend.map((term, index) => {
		return (<label key={index} className={`${manager.state.selectedTokenIndex != -1 && currentLegend == term.id ? 'selected' : ''}`}>
			<input type="radio" name="token-type-selection" value={term.id} onChange={tokenTypeSelection} checked={manager.state.selectedTokenIndex != -1 && currentLegend == term.id} />
			<span className="color-radio" style={{ background: term.color }}></span>{term.name.length > 0 ? term.name : 'Untitled Legend Item'}
		</label>)
	})

	return (
		<section className="card phrase-builder">
			<header>Phrase to Complete</header>
			<div className={`token-tutorial ${manager.state.showTokenTutorial ? 'show' : 'minimized'}`} onClick={toggleTokenTutorial}>
				<p><span className="icon-notification"></span>Use the input to the left to create the individual <span className="strong">tokens</span> that will make up your phrase. Tokens can be a word, multiple words, a part of speech, grammar symbol, or any combination.
					The tokens will be randomly ordered when a student plays the widget.</p>
			</div>
			<div className="token-container">
				{tokenList}
				<div className="token-input-container">
					<input className="token-input" onKeyDown={handleTokenInput} placeholder="..." maxLength={MAX_TOKEN_CHARS}></input>
				</div>
			</div>
			<div className={`token-type-selector ${manager.state.selectedTokenIndex != -1 ? "show" : ""}`}>
				<header>Select the corresponding legend item for this token:</header>
				<form id="tokenTypeSelection">
					{legendSelection}
					<span className="legend-reminder">Open the <a href="#" onClick={() => { props.toggleLegend() }}>Legend</a> to create additional token categories.</span>
				</form>
			</div>
		</section>
	)
}

export default PhraseBuilder
