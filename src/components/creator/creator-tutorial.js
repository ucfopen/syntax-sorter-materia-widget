import React, {useContext} from 'react'
import { store } from '../../creator-store'

const CreatorTutorial = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const dismiss = () => {
		dispatch({type: 'dismiss_tutorial'})
	}

	return (
		<div className='modal-wrapper' style={{display: global.state.showTutorial ? 'block' : 'none'}}>
			<div className='modal tutorial creator'>
				<span className='dev-warning'>This widget is still a work in progress.</span>
				<h3>Build Effective Language Tools</h3>
				{/* <img src='assets/img/creator-tutorial.png' alt='creator tutorial' /> */}
				<p>Identify parts of speech using the <span className='strong'>Legend</span>. <img src='assets/img/creator-tutorial-legend.png' alt='creator tutorial' /></p>

				<p>Provide <span className='strong'>instructions</span> or a <span className='strong'>prompt</span> for each question.</p>

				<p><img src='assets/img/creator-tutorial-phrase.png' alt='creator tutorial' />Assemble a <span className='strong'>sentence</span> or <span className='strong'>phrase</span> by entering each word, phrase, or part of speech - then identify each by their part of speech from the <span className='strong'>Legend.</span></p>
				<button onClick={dismiss}>Let's Go</button>
			</div>
			<div className='modal-bg'></div>
		</div>
	)
}

export default CreatorTutorial