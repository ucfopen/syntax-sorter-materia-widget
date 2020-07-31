import React, {useContext} from 'react'
import Token from './token'
import { store } from '../../player-store'

const TokenDrawer = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const paginate = () => {
		dispatch({type: 'paginate_question_forward'})
	}

	let tokenList = props.phrase?.map((token, index) => {
		return <Token
					key={index}
					index={index}
					type={token.legend}
					value={token.value}
					pref={props.displayPref}
					status={token.status}>
				</Token>
	})

	let isLastQuestion = global.state.currentIndex == global.state.items.length - 1

	return(
		<section className={`token-drawer ${props.phrase?.length == 0 ? 'empty' : ''}`}>
			{tokenList}
			<div className='empty-section'>
			<span className='empty-message' style={{display: isLastQuestion ? 'none' : 'inline-block'}}>
					You've sorted every item! You can still rearrange them or continue to the next question.
				</span>
				<span className='empty-message' style={{display: isLastQuestion ? 'inline-block' : 'none'}}>
					You've sorted every item! Select <strong>Submit</strong> at the top-right for scoring or feel free to go back and adjust your answers.
				</span>
				<button onClick={paginate} style={{display: isLastQuestion ? 'none' : 'inline-block'}}>Next Question</button>
			</div>
		</section>
	)
}

export default TokenDrawer
