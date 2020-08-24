import React, { useContext } from 'react'
import Token from './token'
import { store } from '../../creator-store'

const FakeoutBuilder = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	// const currentFakePref = (global.state.items[global.state.currentIndex] && global.state.items[global.state.currentIndex].fakesPref != undefined) ? global.state.items[global.state.currentIndex].fakesPref : 'no'
	const currentLegend = (global.state.selectedFakeoutIndex != -1 && global.state?.items[global.state.currentIndex]?.fakes[global.state.selectedFakeoutIndex]?.legend != undefined) ? global.state.items[global.state.currentIndex].fakes[global.state.selectedFakeoutIndex].legend : -1

	const handleTokenInput = (event) => {
		switch (event.which) {
			case 8: // backspace
				// convert prior token back to input
				if (event.target.value.length == 0) {
					event.preventDefault()
					if (props.fakes.length < 1) return
					let text = convertTokenToInput(props.fakes.length - 1)
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
		let text = global.state.items[global.state.currentIndex].fakes[index].value
		dispatch({type: 'fakeout_token_to_input', payload: {
			questionIndex: global.state.currentIndex,
			fakeoutIndex: index
		}})
		return text
	}

	const convertInputToToken = (input) => {
		dispatch({type: 'fakeout_input_to_token', payload: {
			questionIndex: global.state.currentIndex,
			text: input
		}})
	}

	const tokenTypeSelection = (event) => {
		let selection = parseInt(event.target.value)
		dispatch({type:'fakeout_token_type_select', payload: {
			questionIndex: global.state.currentIndex,
			fakeoutIndex: global.state.selectedFakeoutIndex,
			selection: selection
		}})
	}

	let tokenList = props.fakes?.map((term, index) => {
		return <Token key={index} index={index} type={term.legend} context="fakeout" value={term.value}></Token>
	})



	let legendSelection = props.legend.map((term, index) => {
		return(<label key={index} className={`${global.state.selectedFakeoutIndex != -1 && currentLegend == term.id ?  'selected' : ''}`}>
			<input type="radio" name="token-type-selection" value={term.id} onChange={tokenTypeSelection} checked={global.state.selectedFakeoutIndex != -1 && currentLegend == term.id}/>
			<span className="color-radio" style={{background: term.color}}></span>{term.name}
		</label>)
	})

	return (
		<section className="fakeout-builder">
			<div className="token-container">
				{tokenList}
				<input className="token-input" onKeyDown={handleTokenInput} placeholder="..."></input>
			</div>
			<div className={`token-type-selector ${global.state.selectedFakeoutIndex != -1 ? "show" : ""}`}>
				<header>What type of word is this?</header>
				<form id="tokenTypeSelectionFake">
					{legendSelection}
				</form>
			</div>
		</section>
	)
}

export default FakeoutBuilder
