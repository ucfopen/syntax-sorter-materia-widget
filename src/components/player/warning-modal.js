import React, { useContext } from 'react'
import { store } from '../../player-store'

const WarningModal = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const toggle = () => {
		dispatch({ type: 'toggle_warning' })
	}

	return (
		<div className='warning-wrapper' style={{ display: manager.state.showWarning ? 'flex' : 'none' }}>
			<div className='warning'>
				<span className='dev-warning'>You still have unfinished questions.</span>
				{props.requireAllQuestions ?
					<div>
						<h3>Please answer all questions before submitting.</h3>
						<div className='warning-submit-holder'>
							<button onClick={toggle}>Ok</button>
						</div>
					</div>
					:
					<div>
						<h3>Are you sure you want to submit?</h3>
						<div className='warning-submit-holder'>
							<button onClick={toggle}>No</button>
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
