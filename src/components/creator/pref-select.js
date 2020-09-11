import React, { useContext } from 'react'
import { store } from '../../creator-store'

const PrefSelect = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const handleTokenDisplayPref = (event) => {
		dispatch({type: 'update_display_pref', payload: {
			questionIndex: global.state.currentIndex,
			pref: event.target.value
		}})
	}

	const toggleHintModal = () => {
		dispatch({type: 'toggle_hint_modal'})
	}

	const toggleFakeoutModal = () => {
		dispatch({type: 'toggle_fakeout_modal'})
	}

	return (
		<div className="pref-holder">
			<div className="card pref-card">
				<div className="pref-options">
					<header>How should each token be displayed to students?</header>
					<span className="pref-select">
						<input type="radio" name="token-display-select" value={"word"} onChange={handleTokenDisplayPref} checked={props.displayPref == 'word'}/>
						<span className={`radio-overlay ${props.displayPref == 'word' ? 'selected' : ''}`}></span>
						Word
					</span>
					<span className="pref-select">
						<input type="radio" name="token-display-select" value={"part-of-speech"} onChange={handleTokenDisplayPref} checked={props.displayPref == 'part-of-speech'}/>
						<span className={`radio-overlay ${props.displayPref == 'part-of-speech' ? 'selected' : ''}`}></span>
						Legend
					</span>
				</div>
			</div>
			<div className="pref-spacer"></div>
			<div className="options-holder">
				<div className="card more-card" onClick={toggleHintModal}>
					<p>Set Guess Limits and Hints</p>
					<p className={`guess-limit-tip ${props.checkPref == true ? "show" : ""}`} >Guess limit: {props.numChecks}, hint: {props.hint?.length > 0 ? "enabled" : "disabled"}</p>
				</div>
				<div className="options-spacer"></div>
				<div className="card more-card" onClick={toggleFakeoutModal}>
					<p>Add "Fake" Tokens</p>
					<p className={`guess-limit-tip ${props.fakes.length > 0 ? "show" : ""}`} >Fake Tokens: {props.fakes?.length}</p>
				</div>
			</div>
		</div>
	)
}

export default PrefSelect
