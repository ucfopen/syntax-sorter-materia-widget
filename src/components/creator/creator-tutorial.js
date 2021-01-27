import React, { useContext } from 'react'
import { store } from '../../creator-store'

const CreatorTutorial = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const dismiss = () => {
		dispatch({ type: 'dismiss_tutorial' })
	}

	return (
		<div className='modal-wrapper' style={{ display: manager.state.showTutorial ? 'block' : 'none' }}>
			<div className='modal tutorial creator'>
				<h3>Build Effective Syntax Mastery Tools</h3>
				<div className='tutorial-content'>
					<p>1. Identify syntax elements using the <span className='strong'>Legend</span>. For example, if the phrase is another language, you might use the Legend to identify parts of speech.</p>
					<img className='right' src='assets/img/creator-tutorial-legend.png' alt='Example screenshot of the token legend.' />
				</div>
				<div className='tutorial-content'>
					<p>2. Provide <span className='strong'>instructions</span> or a <span className='strong'>prompt</span> for each question.</p>
					<img className='right' src='assets/img/creator-tutorial-question.png' alt='Example screenshot of the question text.' />
				</div>
				<div className='tutorial-content'>
					<p>3. Assemble a <span className='strong'>sentence</span> or <span className='strong'>phrase</span> by entering each word, phrase, or part of speech - then identify each token by their syntax from the <span className='strong'>Legend.</span></p>
					<img className='right' src='assets/img/creator-tutorial-phrase.png' alt='Example screenshot of phrase assembly.' />
				</div>
				<p>4. You can optionally enable additional features, like allowing students <span className="strong">additional attempts</span> for specific questions, or create additional <span className="strong">"fake" tokens</span> that will appear alongside the real ones.</p>
				<button onClick={dismiss}>Let's Go</button>
			</div>
			<div className='modal-bg'></div>
		</div>
	)
}

export default CreatorTutorial