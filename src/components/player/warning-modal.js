import React, { useContext } from 'react'
import { store } from '../../player-store'

const WarningModal = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const toggle = () => {
		dispatch({ type: 'toggle_warning' })
	}

	return (
		<div className='warning-wrapper' style={{ display: global.state.showWarning ? 'flex' : 'none' }}>
			<div className='warning'>
				<span className='dev-warning'>You still have unfinished questions.</span>
				<h3>Are you sure you want to submit?</h3>
				<div className='warning-submit-holder'>
					<button onClick={toggle}>No</button>
					<button onClick={props.submitForScoring}>Yes</button>
				</div>
			</div>
			<div className='warning-bg'>
			</div>
		</div>
	)

}

export default WarningModal
