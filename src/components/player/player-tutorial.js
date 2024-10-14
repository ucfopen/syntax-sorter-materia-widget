import React, { useContext } from 'react'
import { store, DispatchContext } from '../../player-store'

const PlayerTutorial = (props) => {

	const state = useContext(store)
	const dispatch = useContext(DispatchContext)

	const toggle = () => {
		dispatch({ type: 'toggle_tutorial' })
	}

	return (
		<div
		className='modal-wrapper'
		style={{ display: state.showTutorial ? 'flex' : 'none' }}>
			<div className='modal tutorial player'
			aria-modal="true"
			role="alertdialog"
			aria-labelledby="dialog-title"
			aria-describedby="dialog-desc">
				<h3 id="dialog-title">Arrange Tokens in the Proper Order</h3>
				<div id="dialog-desc">
					<div className='tutorial-content'>
						<p>Read each question prompt and arrange the tokens based on the instructions provided. Tokens may be a word, part of a word, or a part of speech. <span className='strong'>Right-click</span> or <span className='strong'>drag</span> a token back to the drawer to unsort it. Keyboard users can use <span className='strong'>Space</span> or <span className='strong'>Enter</span> to sort and unsort a focused token, and <span className='strong'>Q</span> and <span className='strong'>E</span> to rearrange it.</p>
						<img className='right' src="assets/img/player-tutorial-1.png" alt="Player tutorial image demonstrating dragging and dropping tokens" />
					</div>
					<div className='tutorial-content'>
						<p>To read out the tokens you have sorted, press <span className='strong'>R</span> or click the <span className='strong'>Speaker</span> on the bottom right of the sorting area.</p>
					</div>
					<div className='tutorial-content'>
						<img className='left' src="assets/img/player-tutorial-2.png" alt="Player tutorial image demonstrating using the color legend." />
						<p>Tokens are color-coded based on their syntax. Use the Legend at the bottom to associate each color with its corresponding syntax.</p>
					</div>
					<div className='tutorial-content'>
						<p>Some questions may allow you to check your answer multiple times before submitting for a score. Use the <span className='strong'>Check Answer</span> button to see how you did!</p>
						<img className='right' src="assets/img/player-tutorial-3.png" alt="Player tutorial image demonstrating using the Check Answer feature." />
					</div>
					<div className='tutorial-content'>
						<p>Some questions may have hints. Press <span className='strong'>H</span> to play the hint if it's available.</p>
					</div>
				</div>
				<button onClick={toggle} id="tutorial-ready-btn">I'm Ready</button>
			</div>

			<div className='modal-bg' onClick={toggle}>
			</div>
		</div>
	)

}

export default PlayerTutorial
