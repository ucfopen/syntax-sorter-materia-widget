import React, {useContext} from 'react'
import { store } from '../../creator-store'
import FakeoutBuilder from './fakeout-builder'

const CreatorFakeoutModal = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const dismiss = () => {
		dispatch({type: 'toggle_fakeout_modal'})
	}

	return (
		<div className='modal-wrapper' style={{display: global.state.showFakeoutModal ? 'block' : 'none'}}>
			<div className='modal creator wide'>
				<h3>Add "Fake" Tokens</h3>
				<p>You can optionally create additional tokens that will be added to the "real" tokens students are provided for this question.
					The student will be penalized for adding any of these "fake" tokens to the arrangement.</p>
				<FakeoutBuilder
					fakes={props.fakes}
					legend={global.state.legend}></FakeoutBuilder>
				<button onClick={dismiss}>Okay</button>
			</div>
			<div className='modal-bg'></div>
		</div>
	)
}

export default CreatorFakeoutModal
