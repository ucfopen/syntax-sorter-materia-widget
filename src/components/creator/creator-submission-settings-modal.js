import React, {useContext} from 'react'
import { store } from '../../creator-store'

const CreatorSubmissionSettingsModal = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const handleToggleSubmissionSettings = (event) => {
		dispatch({type:'toggle_require_all_questions', payload: event.target.value == 'true' ? true : false})
	}

	const dismiss = () => {
		dispatch({type: 'toggle_submission_settings_modal'})
	}

	return (
		<div className='modal-wrapper' style={{display: global.state.showSubmissionSettingsModal ? 'block' : 'none'}}>
			<div className='modal creator'>
				<h3>Submission Settings</h3>
				<span className="select-wrapper">
					<span className="strong">Require all questions?</span>
					<span className="pref-select">
						<input type="radio" name="question-bank-toggle" value={true} onChange={handleToggleSubmissionSettings} checked={props.requireAllQuestions == true}/>
						<span className={`radio-overlay ${props.requireAllQuestions == true ? 'selected' : ''}`}></span>
						Yes
					</span>
					<span className="pref-select">
						<input type="radio" name="question-bank-toggle" value={false} onChange={handleToggleSubmissionSettings} checked={props.requireAllQuestions == false}/>
						<span className={`radio-overlay left ${props.requireAllQuestions == false ? 'selected' : ''}`}></span>
						No
					</span>
				</span>
				<span className="select-wrapper">
					If enabled, students must respond to all questions before submission by sorting at least one token per question. Empty responses are not allowed.
				</span>
				
				<button onClick={dismiss}>Okay</button>
			</div>
			<div className='modal-bg'></div>
		</div>
	)
}

export default CreatorSubmissionSettingsModal
