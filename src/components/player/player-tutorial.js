import React, {useContext} from 'react'
import { store } from '../../player-store'

const PlayerTutorial = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const dismiss = () => {
		dispatch({type: 'dismiss_tutorial'})
	}

	return(
		<div className='tutorial-wrapper' style={{display: global.state.showTutorial ? 'block' : 'none'}}>

			<div className='tutorial'>
				<span className='dev-warning'>This widget is still a work in progress.</span>
				<h3>Arrange Speech Tokens in the Proper Order</h3>
				<p>Read each question prompt and arrange the tokens based on the instructions provided. Tokens may be a word, part of a word, or a part of speech.</p>
				<span>(PH - need an image)</span>
				<p>Tokens are color-coded based on their part of speech.</p>
				<span>(PH - need an image)</span>
				<button onClick={dismiss}>I'm Ready</button>
			</div>

			<div className='tutorial-bg'>
			</div>
		</div>
	)

}

export default PlayerTutorial