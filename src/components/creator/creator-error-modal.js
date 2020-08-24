import React, {useContext} from 'react'
import { store } from '../../creator-store'

const CreatorErrorModal = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const currentErrorMessage = global.state ? global.state.errorMsg : ""
	// const currentError = global.state ? global.state.showErrorModal : false

	const dismiss = () => {
		dispatch({
			type: 'toggle_error_modal',
			payload: {
				error: []
			}
		})
	}

	let validationErrors = global.state.errors.map((error, index) => {
		return <span className="strong error" key={index}>{error}</span>
	})

	return (
		<div className='modal-wrapper' style={{display: global.state.showErrorModal ? 'block' : 'none'}}>
			<div className='modal creator'>
				<h3>Before You Can Save...</h3>
				<p>The following validation checks failed. Fix each of them below to save your work.</p>
				{validationErrors}
				<button onClick={dismiss}>Okay</button>
			</div>
			<div className='modal-bg'></div>
		</div>
	)
}

export default CreatorErrorModal
