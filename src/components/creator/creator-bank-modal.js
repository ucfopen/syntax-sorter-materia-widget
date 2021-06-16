import React, { useContext } from 'react'
import { store } from '../../creator-store'

const CreatorBankModal = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const handleToggleQuestionBank = (event) => {
		dispatch({ type: 'toggle_ask_limit', payload: event.target.value == 'true' ? true : false })
	}

	const handleNumAskUpdate = (event) => {
		let count = event.target.value
		if (event.target.value > props.questionCount || event.target.value <= 0) count = props.questionCount
		dispatch({ type: 'update_num_ask', payload: count })
	}

	const dismiss = () => {
		dispatch({ type: 'toggle_bank_modal' })
	}

	return (
		<div className='modal-wrapper' style={{ display: manager.state.showBankModal ? 'flex' : 'none' }}>
			<div className='modal creator'>
				<h3>Question Bank Settings</h3>
				<p>Optionally set a question limit that's lower than the total number of questions created for this widget. The questions will be randomly selected each time the widget is played.</p>
				<span className="select-wrapper">
					<strong>Enable Question Bank?</strong>
					<span className="pref-select">
						<input type="radio" name="question-bank-toggle" value={true} onChange={handleToggleQuestionBank} checked={props.enableQuestionBank == true} />
						<span className={`radio-overlay ${props.enableQuestionBank == true ? 'selected' : ''}`}></span>
						Yes
						</span>
					<span className="pref-select">
						<input type="radio" name="question-bank-toggle" value={false} onChange={handleToggleQuestionBank} checked={props.enableQuestionBank == false} />
						<span className={`radio-overlay left ${props.enableQuestionBank == false ? 'selected' : ''}`}></span>
						No
					</span>
				</span>
				<span className={`check-select select-wrapper ${props.enableQuestionBank ? '' : 'disabled'}`}>
					<span className="strong">Number of questions to ask:</span>
					<input className="num-ask"
						type="number" name="check-val"
						onChange={handleNumAskUpdate}
						value={props.enableQuestionBank ? props.numAsk : props.questionCount}
						min="1" max={props.questionCount}
						disabled={props.enableQuestionBank == false} />
					<span>out of {props.questionCount}</span>
				</span>
				<button onClick={dismiss}>Okay</button>
			</div>
			<div className='modal-bg'></div>
		</div>
	)
}

export default CreatorBankModal
