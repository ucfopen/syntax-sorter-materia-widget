import React, {useContext} from 'react'
import { store } from '../../creator-store'

const CreatorHintsModal = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const dismiss = () => {
		dispatch({type: 'toggle_hint_modal'})
	}

	const handleCheckPref = (event) => {
		dispatch({type: 'update_check_pref', payload: {
			questionIndex: global.state.currentIndex,
			pref: event.target.value == 'true' ? true : false
		}})
	}

	const handleNumChecks = (event) => {
		dispatch({type: 'update_num_checks', payload: {
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

	return (
		<div className='modal-wrapper' style={{display: global.state.showHintModal ? 'block' : 'none'}}>
			<div className='modal creator'>
				<h3>Guess Limits and Hints</h3>
				<p>Enable guess attempts for each question? Students will be informed whether or not the provided token arrangement is correct prior to submitting the widget for scoring.</p>
				<span className="select-wrapper">
					<span className="strong">Enable Guess Attempts?</span>
					<span className="pref-select">
						<input type="radio" name="check-select" value={true} onChange={handleCheckPref} checked={props.checkPref == true}/>
						<span className={`radio-overlay ${props.checkPref == true ? 'selected' : ''}`}></span>
						Yes
					</span>
					<span className="pref-select">
						<input type="radio" name="check-select" value={false} onChange={handleCheckPref} checked={props.checkPref == false}/>
						<span className={`radio-overlay left ${ props.checkPref == false ? 'selected' : ''}`}></span>
						No
					</span>
				</span>
				<span className={`select-wrapper ${props.checkPref ? '' : 'disabled'}`}>
					<span className="check-select">
						<span className="strong">Number of guess attempts:</span>
						<input type="number" name="check-val" onChange={handleNumChecks} value={props.numChecks} placeholder="1" min="1" max="5" disabled={props.checkPref == false}/>
					</span>
				</span>
				<span className={`select-wrapper ${props.checkPref ? '' : 'disabled'}`} disabled={props.checkPref == false}>
					<span className="check-select bottom">
						Hint (optional)
						<input className="hint-text" type="text" name="hint-val" onChange={handleHint} value={props.hint} disabled={props.checkPref == false}/>
					</span>
				</span>
				<button onClick={dismiss}>Okay</button>
			</div>
			<div className='modal-bg'></div>
		</div>
	)
}

export default CreatorHintsModal
