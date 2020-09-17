import React, { useContext } from 'react'
import { store } from '../../creator-store'
import StudentPreview from './student-preview'

const PrefSelect = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const handleTokenDisplayPref = (event) => {
		dispatch({type: 'update_display_pref', payload: {
			questionIndex: global.state.currentIndex,
			pref: event.target.value
		}})
	}
	
	return (
		<div className="card split">
			<div className="pref-options">
				<header>How should each token be displayed &amp; scored?</header>
				<span className="pref-select">
					<input type="radio" name="token-display-select" value={"word"} onChange={handleTokenDisplayPref} checked={props.displayPref == 'word'}/>
					<span className={`radio-overlay ${props.displayPref == 'word' ? 'selected' : ''}`}></span>
					<span className="strong">By Word</span>: Both the word and the legend value must match.
				</span>
				<span className="pref-select">
					<input type="radio" name="token-display-select" value={"legend"} onChange={handleTokenDisplayPref} checked={props.displayPref == 'legend'}/>
					<span className={`radio-overlay ${props.displayPref == 'legend' ? 'selected' : ''}`}></span>
					<span className="strong">By Legend</span>: Only the legend value of a token matters. The word will not be shown.
				</span>
			</div>
			<StudentPreview displayPref={props.displayPref}></StudentPreview>
		</div>
	)
}

export default PrefSelect
