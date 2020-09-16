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
				<p>Increase the difficulty of your question by adding additional tokens alongside the "real" ones. The student will be notified that these extra tokens exist, and that not all
					tokens available may be part of the final phrase.</p>
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
