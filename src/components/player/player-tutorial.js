import React, { useContext } from 'react'
import { store } from '../../player-store'

const PlayerTutorial = (props) => {

	const manager = useContext(store)
	const dispatch = manager.dispatch

	const toggle = () => {
		dispatch({ type: 'toggle_tutorial' })
	}

	return (
		<div
		aria-modal="true"
		role="dialog"
		aria-labelledby="dialog-title"
		aria-describedby="dialog-desc"
		className='modal-wrapper'
		style={{ display: manager.state.showTutorial ? 'flex' : 'none' }}>

			<div id="dialog-desc" className='modal tutorial player'>
				<h3 id="dialog-title">Arrange Tokens in the Proper Order</h3>
				<div className='tutorial-content'>
					<p>Read each question prompt and arrange the tokens based on the instructions provided. Tokens may be a word, part of a word, or a part of speech. <span className='strong'>Right-click</span> or <span className='strong'>drag</span> a token back to the drawer to unsort it. </p>
					<img className='right' src="assets/img/player-tutorial-1.png" alt="Player tutorial image demonstrating dragging and dropping tokens" />
				</div>
				<div className='tutorial-content'>
					<p>If using a keyboard, select a token in the drawer and press <span className='strong'>Space</span> or <span className='strong'>Enter</span> to sort it. To rearrange a token in the sorting area, press <span className='strong'>Q</span> to move it left and <span className='strong'>E</span> to move it right.</p>
				</div>
				<div className='tutorial-content'>
					<img className='left' src="assets/img/player-tutorial-2.png" alt="Player tutorial image demonstrating using the color legend." />
					<p>Tokens are color-coded based on their syntax. Use the Legend at the bottom to associate each color with its corresponding syntax.</p>
				</div>
				<div className='tutorial-content'>
					<p>Some questions may allow you to check your answer multiple times before submitting for a score. Use the <span className='strong'>Check Answer</span> button to see how you did!</p>
					<img className='right' src="assets/img/player-tutorial-3.png" alt="Player tutorial image demonstrating using the Check Answer feature." />
				</div>
				<button onClick={toggle}>I'm Ready</button>
			</div>

			<div className='modal-bg'>
			</div>
		</div>
	)

}

export default PlayerTutorial
