import React, { useContext } from 'react'
import Token from './token'
import { store } from '../../creator-store'

const PhraseBuilder = (props) => {
	
	const global = useContext(store)
	const dispatch = global.dispatch

	const handleTokenInput = (event) => {
		switch (event.which) {
			case 8: // backspace
				// convert prior token back to input
				if (event.target.value.length == 0) {
					event.preventDefault()
					if (props.phrase.length < 1) return
					let text = convertTokenToInput(props.phrase.length - 1)
					event.target.value = decodeURIComponent(text)
				}
				break;
			case 13: // enter
				// convert input to token
				convertInputToToken(event.target.value)
				event.target.value = ""
			default:
				return;
		}
	}

	const convertTokenToInput = (index) => {
		let text = global.state.items[global.state.currentIndex].phrase[index].value
		dispatch({type: 'phrase_token_to_input', payload: {
			questionIndex: global.state.currentIndex,
			phraseIndex: index
		}})
		return text
	}

	const convertInputToToken = (input) => {
		dispatch({type: 'phrase_input_to_token', payload: {
			questionIndex: global.state.currentIndex,
			text: input
		}})
	}

	const tokenTypeSelection = (event) => {
		let selection = parseInt(event.target.value)
		dispatch({type:'phrase_token_type_select', payload: {
			questionIndex: global.state.currentIndex,
			phraseIndex: global.state.selectedTokenIndex,
			selection: selection
		}})
	}

	let tokenList = props.phrase.map((term, index) => {
		return <Token key={index} index={index} type={term.legend} value={term.value}></Token>
	})

	let legendSelection = props.legend.map((term, index) => {
		return(<label key={index} className={`${global.state.selectedTokenIndex != -1 && global.state.items[global.state.currentIndex].phrase[global.state.selectedTokenIndex].legend == term.id ?  'selected' : ''}`}>
			<input type="radio" name="token-type-selection" value={term.id} onChange={tokenTypeSelection} checked={global.state.selectedTokenIndex != -1 && global.state.items[global.state.currentIndex].phrase[global.state.selectedTokenIndex].legend == term.id}/>
			<span className="color-radio" style={{background: term.color}}></span>{term.name}
		</label>)
	})

	return (
		<section className="card phrase-builder">
			<header>Phrase to Complete</header>
			<div className="token-container">
				{tokenList}
				<input className="token-input" onKeyDown={handleTokenInput} placeholder="..."></input>
			</div>
			<div className={`token-type-selector ${global.state.selectedTokenIndex != -1 ? "show" : ""}`}>
				<header>What type of word is this?</header>
				<form id="tokenTypeSelection">
					{legendSelection}
				</form>
			</div>
		</section>
	)
}

export default PhraseBuilder