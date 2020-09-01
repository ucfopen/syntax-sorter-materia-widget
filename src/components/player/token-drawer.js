import React, {useContext} from 'react'
import Token from './token'
import { store } from '../../player-store'

const TokenDrawer = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const paginate = () => {
		dispatch({type: 'paginate_question_forward'})
	}

	const HandleGuessCheck = () => {
		let item = global.state.items[global.state.currentIndex]

		// attempt limit already reached, assume call is invalid
		if (props.responseState == 'incorrect-no-attempts') return

		let response = verify(item)
		let state = 'none'

		if (!response) {
			if ((props.attemptLimit - 1) > props.attemptsUsed) {
				state = 'incorrect-attempts-remaining'
			}
			else {
				state = 'incorrect-no-attempts'
			}
		}
		else {
			state = 'correct'
		}

		dispatch({type: 'attempt_submit', payload: {
			questionIndex: global.state.currentIndex,
			response: state
		}})
	}

	const verify = (item) => {
		
		if (item.sorted.length != item.correctPhrase.length) {
			return false
		}

		for (let i = 0; i < item.sorted.length; i++) {

			if (item.displayPref == 'word') {
				if (item.sorted[i].value != item.correctPhrase[i].value) return false
			}
			else if (item.displayPref == 'part-of-speech') {
				if (item.sorted[i].legend != item.correctPhrase[i].legend) return false
			}
		}
		return true
	}

	let tokenList = props.phrase?.map((token, index) => {
		return <Token
					key={index}
					index={index}
					type={token.legend}
					value={token.value}
					pref={props.displayPref}
					status={token.status}
					fakeout={token.fakeout}
					dragEligible={!(props.guessPref && props.attemptsUsed >= props.attemptLimit)}>
				</Token>
	})

	let isLastQuestion = global.state.currentIndex == global.state.items.length - 1

	let currentResponseText = ''

	switch (props.responseState) {
		case 'ready':
			if (isLastQuestion) {
				currentResponseText = <span className='controls-message'>When you're ready, select <strong>Submit</strong> at the top-right for scoring or go back and review your answers.</span>
			}
			else if (props.hasFakes) {
				currentResponseText = <span className='controls-message'>When you're ready, select <strong>Next Question</strong> to continue.</span>
			}
			else {
				currentResponseText = <span className='controls-message'>You've sorted every item! When you're ready, select <strong>Next Question</strong> to continue.</span>
			}
			break
		case 'pending':
			currentResponseText = <span>PENDING</span>
			break
		case 'incorrect-attempts-remaining':
			let remaining = props.attemptLimit - props.attemptsUsed
			currentResponseText = <span className='controls-message'>That's not quite right. You have {remaining} attempt{remaining > 1 ? 's' : ''} remaining.</span>
			break
		case 'incorrect-no-attempts':
			if (isLastQuestion) {
				currentResponseText = <span className='controls-message'>That's not quite right. You've exhausted your attempts for this question. When you're ready, select <strong>Submit</strong> at the top-right for scoring or go back and review your answers.</span>
			}
			else {
				currentResponseText = <span className='controls-message'>That's not quite right. You've exhausted your attempts for this question. Select <strong>Next Question</strong> to continue.</span>
			}
			break
		case 'correct':
			if (isLastQuestion) {
				currentResponseText = <span className='controls-message'>Nice work! You aced it. When you're ready, select <strong>Submit</strong> at the top-right for scoring or go back and review your answers.</span>
			}
			else
			{
				currentResponseText = <span className='controls-message'>Nice work! You aced it. Select <strong>Next Question</strong> to continue.</span>
			}
			break
		case 'none':
		default:
			currentResponseText = <span>NONE</span>
			break
	}

	return(
		<section className={'token-drawer ' +
			`${(props.phrase?.length == 0) ? 'empty ' : ''}` +
			`${props.responseState} ` +
			`${props.hasFakes ? 'has-fakes ' : ''}`}>
			{tokenList}
			<section className='response-controls'>
				<div className='response-message-container'>
					{currentResponseText}
				</div>
				<div className='button-container'>
					<button className={`verify ${props.guessPref && props.attemptLimit > props.attemptsUsed && props.responseState != 'correct' ? 'show' : ''}`} onClick={HandleGuessCheck}>Check Answer</button>
					<button className={`paginate ${!isLastQuestion ? 'show' : ''}`} onClick={paginate}>Next Question</button>
				</div>
			</section>
		</section>
	)
}

export default TokenDrawer
