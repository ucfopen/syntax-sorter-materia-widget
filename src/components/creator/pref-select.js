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
						<input type="radio" name="token-display-select" value={"legend"} onChange={handleTokenDisplayPref} checked={props.displayPref == 'legend'}/>
						<span className={`radio-overlay ${props.displayPref == 'legend' ? 'selected' : ''}`}></span>
						Legend
					</span>
				</div>
			</div>
			<div className="pref-spacer"></div>
			<div className="options-holder">
				<div role="button" className="card more-card" onClick={toggleHintModal}>
					<p>Edit Attempts and Hint</p>
					<p className={`guess-limit-tip ${props.attempts > 1 ? "show" : ""}`} >Attempts: {props.attempts}, Hint: {props.hint?.length > 0 ? "enabled" : "No Hint"}</p>
				</div>
				<div className="options-spacer"></div>
				<div role="button" className="card more-card" onClick={toggleFakeoutModal}>
					<p>Edit "Fake" Tokens</p>
					<p className={`guess-limit-tip ${props.fakes.length > 0 ? "show" : ""}`} >Fake Tokens: {props.fakes?.length}</p>
				</div>
			</div>
		</div>
	)
}

export default PrefSelect
