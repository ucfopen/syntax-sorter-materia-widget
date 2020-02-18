import React, { useContext } from 'react'
import { store } from '../../creator-store'

const PrefSelect = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const currentPref = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].displayPref : 'word'

	const handleTokenDisplayPref = (event) => {
		dispatch({type: 'update_display_pref', payload: {
			questionIndex: global.state.currentIndex,
			pref: event.target.value
		}})
	}

	return (
		<div className="card additional-options">
			<header>How should each token be displayed to students?</header>
			<span className="pref-select">
				<input type="radio" name="token-display-select" value={"word"} onChange={handleTokenDisplayPref} checked={currentPref == 'word'}/>
				<span className={`radio-overlay ${currentPref == 'word' ? 'selected' : ''}`}></span>
				Word
			</span>
			<span className="pref-select">
				<input type="radio" name="token-display-select" value={"part-of-speech"} onChange={handleTokenDisplayPref} checked={currentPref == 'part-of-speech'}/>
				<span className={`radio-overlay ${currentPref == 'part-of-speech' ? 'selected' : ''}`}></span>
				Part of Speech
			</span>
		</div>
	)
}

export default PrefSelect