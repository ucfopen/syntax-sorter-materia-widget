import React, {useContext} from 'react'
import { store } from '../../creator-store'

const CreatorIncompleteAttempModal = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const handleToggleIncompleteAttempt = (event) => {
		dispatch({type:'toggle_incomplete_attempt', payload: event.target.value == 'true' ? true : false})
	}

	const dismiss = () => {
		dispatch({type: 'toggle_incomplete_attempt_modal'})
	}

	return (
		<div className='modal-wrapper' style={{display: global.state.showIncompleteAttemptModal ? 'block' : 'none'}}>
			<div className='modal creator'>
				<h3>Incomplete Attempts</h3>
				<p>Allow students to submit a widget without having answered every question?</p>
				<span className="pref-select">
					<input type="radio" name="question-bank-toggle" value={true} onChange={handleToggleIncompleteAttempt} checked={props.allowIncompleteAttempt == true}/>
					<span className={`radio-overlay ${props.allowIncompleteAttempt == true ? 'selected' : ''}`}></span>
					Yes
					</span>
					<span className="pref-select">
					<input type="radio" name="question-bank-toggle" value={false} onChange={handleToggleIncompleteAttempt} checked={props.allowIncompleteAttempt == false}/>
					<span className={`radio-overlay left ${props.allowIncompleteAttempt == false ? 'selected' : ''}`}></span>
					No
				</span>
				<button onClick={dismiss}>Okay</button>
			</div>
			<div className='modal-bg'></div>
		</div>
	)
}

export default CreatorIncompleteAttempModal
