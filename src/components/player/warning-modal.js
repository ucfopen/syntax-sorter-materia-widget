import React, { useContext, useEffect, useRef } from 'react'
import { store } from '../../player-store'

const WarningModal = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const submitButtonRef = useRef(null);

	const toggle = () => {
		dispatch({ type: 'toggle_warning' })
	}

	useEffect(() => {
		if (manager.state.showWarning)
		{
			if (submitButtonRef.current != null) submitButtonRef.current.focus();
		}
	}, [manager.state.showWarning])

	return (
		<div
		className='warning-wrapper'
		style={{ display: manager.state.showWarning ? 'flex' : 'none' }}
		>
			<div className='warning'
			role="alertdialog"
			aria-labelledby="dev-warning"
			aria-describedby="warning-desc"
			aria-model="true">
				<p id='dev-warning'>You still have unfinished questions.</p>
				{props.requireAllQuestions ?
					<div>
						<h3 id="warning-desc">Please answer all questions before submitting.</h3>
						<div className='warning-submit-holder'>
							<button id="warning-submit-button" ref={submitButtonRef} onClick={toggle}>Ok</button>
						</div>
					</div>
					:
					<div>
						<h3>Are you sure you want to submit?</h3>
						<div className='warning-submit-holder'>
							<button id="warning-submit-btn" ref={submitButtonRef} onClick={toggle}>No</button>
							<button onClick={props.submitForScoring}>Yes</button>
						</div>
					</div>
				}
			</div>
			<div className='warning-bg'>
			</div>
		</div>
	)

}

export default WarningModal
