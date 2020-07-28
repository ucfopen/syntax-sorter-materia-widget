import React, { useContext } from 'react'
import { store } from '../../creator-store'

const PrefSelect = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const currentPref = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].displayPref : 'word'
	const currentCheckPref = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].checkPref : 'no'
	const currentNumChecks = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].numChecks : 1
	const currentHintPref = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].hintPref : 'no'
	const currentHint = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].hint : ''
	const currentFakeoutPref = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].fakeoutPref : 'no'
	const currentFakeout = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].fakeout : ''

	const handleTokenDisplayPref = (event) => {
		dispatch({type: 'update_display_pref', payload: {
			questionIndex: global.state.currentIndex,
			pref: event.target.value
		}})
	}

	const handleCheckPref = (event) => {
		dispatch({type: 'update_check_pref', payload: {
			questionIndex: global.state.currentIndex,
			pref: event.target.value
		}})
	}

	const handleNumChecks = (event) => {
		dispatch({type: 'update_num_checks', payload: {
			questionIndex: global.state.currentIndex,
			pref: event.target.value
		}})
	}

	const handleHintPref = (event) => {
		dispatch({type: 'update_hint_pref', payload: {
			questionIndex: global.state.currentIndex,
			pref: event.target.value
		}})
	}

	const handleHint = (event) => {
		dispatch({type: 'update_hint', payload: {
			questionIndex: global.state.currentIndex,
			pref: event.target.value
		}})
	}

	const handleFakeoutPref = (event) => {
		dispatch({type: 'update_fakeout_pref', payload: {
			questionIndex: global.state.currentIndex,
			pref: event.target.value
		}})
	}

	const handleFakeout = (event) => {
		dispatch({type: 'update_fakeout', payload: {
			questionIndex: global.state.currentIndex,
			pref: event.target.value
		}})
	}

	return (
		<div>
			<div className="card additional-options">
				<div className="pref-options">
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

				<div className="vl"></div>
				<div className="pref-options">
					<header>Should the student be able to check their answer?</header>
					<span className="pref-select">
						<input type="radio" name="check-select" value={"yes"} onChange={handleCheckPref} checked={currentCheckPref == "yes"}/>
						<span className={`radio-overlay ${currentCheckPref == "yes" ? 'selected' : ''}`}></span>
						Yes
					</span>
					<span className="pref-select">
						<input type="radio" name="check-select" value={"no"} onChange={handleCheckPref} checked={currentCheckPref == "no"}/>
						<span className={`radio-overlay ${currentCheckPref == "no" ? 'selected' : ''}`}></span>
						No
					</span>
					<span className={`check-select ${currentCheckPref == "yes" ? "show" : ""}`}>
						Number of checks
						<input type="number" name="check-val" onChange={handleNumChecks} value={currentNumChecks} placeholder={currentNumChecks} min="1" max="5"/>
					</span>
				</div>
			</div>
			<div className="card additional-options">
				<div className="pref-single">
					<header>Should the student be given a hint if they answer the question wrong?</header>
					<span className="pref-select">
						<input type="radio" name="hint-select" value={"yes"} onChange={handleHintPref} checked={currentHintPref == "yes"}/>
						<span className={`radio-overlay ${currentHintPref == "yes" ? 'selected' : ''}`}></span>
						Yes
					</span>
					<span className="pref-select">
						<input type="radio" name="hint-select" value={"no"} onChange={handleHintPref} checked={currentHintPref == "no"}/>
						<span className={`radio-overlay ${currentHintPref == "no" ? 'selected' : ''}`}></span>
						No
					</span>
					<span className={`hint-select ${currentHintPref == "yes" ? "show" : ""}`}>
						Hint
						<input type="text" name="hint-pref" value={currentHint} onChange={handleHint}/>
					</span>
				</div>
			</div>
			<div className="card additional-options">
				<div className="pref-single">
					<header>Should the question have fakeout words?</header>
					<span className="pref-select">
						<input type="radio" name="hint-select" value={"yes"} onChange={handleFakeoutPref} checked={currentFakeoutPref == "yes"}/>
						<span className={`radio-overlay ${currentFakeoutPref == "yes" ? 'selected' : ''}`}></span>
						Yes
					</span>
					<span className="pref-select">
						<input type="radio" name="hint-select" value={"no"} onChange={handleFakeoutPref} checked={currentFakeoutPref == "no"}/>
						<span className={`radio-overlay ${currentFakeoutPref == "no" ? 'selected' : ''}`}></span>
						No
					</span>
					<span className={`fake-select ${currentFakeoutPref == "yes" ? "show" : ""}`}>
						Enter fakeout words separated by commas
						<input type="text" name="hint-pref" placeholder="apple,bananas,pear" value={currentFakeout} onChange={handleFakeout}/>
					</span>
				</div>
			</div>

		</div>
	)
}

export default PrefSelect
