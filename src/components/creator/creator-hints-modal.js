import React, {useContext} from 'react'
import { store } from '../../creator-store'

const CreatorHintsModal = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const dismiss = () => {
		dispatch({type: 'toggle_hint_modal'})
	}

	const handleAttempts = (event) => {
		let pref = parseInt(event.target.value)
		if (Number.isNaN(pref) || pref < 0 || pref > 9) pref = 1
		
		dispatch({type: 'update_attempts', payload: {
			questionIndex: global.state.currentIndex,
			pref: pref
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
				<h3>Attempts and Hint</h3>
				<p>Edit the total number of attempts for this question. If higher than 1, students can verify whether their response is correct prior to scoring.</p>
				<span className='select-wrapper'>
					<span className="check-select">
						<span className="strong">Number of attempts:</span>
						<input type="number" name="check-val" onChange={handleAttempts} value={props.attempts} placeholder="1" min="1" max="9"/>
					</span>
				</span>
				<span className={`select-wrapper ${props.attempts > 1 ? '' : 'disabled'}`} disabled={props.attempts > 1 == false}>
					<span className="check-select">
						<span className="strong">Hint:</span>
						<input
							className="hint-text"
							type="text"
							name="hint-val"
							value={props.hint}
							disabled={props.attempts > 1 == false}
							placeholder={props.attempts > 1 ? 'Enter an optional hint' : 'Requires an attempt limit higher than 1.'}
							onChange={handleHint} />
					</span>
				</span>
				<button onClick={dismiss}>Okay</button>
			</div>
			<div className='modal-bg'></div>
		</div>
	)
}

export default CreatorHintsModal
