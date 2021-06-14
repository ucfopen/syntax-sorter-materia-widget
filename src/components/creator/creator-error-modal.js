import React, { useContext } from 'react'
import { store } from '../../creator-store'

const CreatorErrorModal = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const currentErrorMessage = manager.state ? manager.state.errorMsg : ""
	// const currentError = manager.state ? manager.state.showErrorModal : false

	const dismiss = () => {
		dispatch({
			type: 'toggle_error_modal',
			payload: {
				error: []
			}
		})
	}

	let validationErrors = manager.state.errors.map((error, index) => {
		return <span className="strong error" key={index}>{error}</span>
	})

	return (
		<div className='modal-wrapper' style={{ display: manager.state.showErrorModal ? 'flex' : 'none' }}>
			<div className='modal creator'>
				<h3>Before You Can Save...</h3>
				<p>The following validation checks failed. Fix each of them below to save your work.</p>
				<div className='error-holder'>
					{validationErrors}
				</div>
				<button onClick={dismiss}>Okay</button>
			</div>
			<div className='modal-bg'></div>
		</div>
	)
}

export default CreatorErrorModal
