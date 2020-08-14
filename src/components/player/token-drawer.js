import React, {useContext} from 'react'
import Token from './token'
import { store } from '../../player-store'

const TokenDrawer = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch
	const currentCheckPref = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].checkPref : 'no'
	const currentChecksUsed = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].checksUsed : 0
	const maxChecks = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].numChecks : 0
	const currentAnswerVal = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].correct : 'none'
	const displayLastText = (currentCheckPref == "no" || (currentAnswerVal == "yes" || currentChecksUsed >= maxChecks))
	const currentFakeoutPref = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].fakeoutPref : 'no'
	const currentTokenOrder = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].tokenOrder : []
	const currentAllReals = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].allReals : []
	const currentAllFakes = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].allFakes : []
	const currentSorted = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].sorted : []

	const paginate = () => {
		dispatch({type: 'paginate_question_forward'})
	}

	const handleCheck = () => {

		// Disables the button if the number of checks has been reached
		if (currentAnswerVal == "yes" || currentChecksUsed >= maxChecks)
		{
			return
		}

		let item = global.state.items[global.state.currentIndex]
		let correct = "yes"
		let correctPhrase = item.correctPhrase
		let sortedArr = item.sorted

		// Answer is of the incorrect size
		if (sortedArr.length != correctPhrase.length)
		{
			correct = "no"
		}

		if (correct == "yes" && item.displayPref == "word")
		{
			// Makes sure the text of the answer array and user sorted array are the same
			for (let i = 0; i < correctPhrase.length; i++)
			{
				if (correctPhrase[i].value != item.sorted[i].value)
				{
					correct = "no"
				}
			}
		}
		else if (correct == "yes" && item.displayPref == "part-of-speech")
		{
			// Makes sure the parts of speech of the answer array and user sorted array are the same
			for (let i = 0; i < correctPhrase.length; i++)
			{
				if (correctPhrase[i].legend != item.sorted[i].legend)
				{
					correct = "no"
				}
			}
		}

		dispatch({type: 'correct_update', payload: {
			questionIndex: global.state.currentIndex,
			answer: correct
		}})

	}

	// Makes sure the order is random but still doesn't randomize every time
	const getTokenList = () => {

		let tokenList = []

		if (currentFakeoutPref == "yes")
		{
			let unsortedFakes = []
			let unsortedReals = []

			// Removes the real tokens that are already in sorted
			for (let i = 0; i < currentAllReals?.length; i++)
			{
				let shouldPush = true

				for (let j = 0; j < currentSorted?.length; j++)
				{
					if (currentSorted[j].value == currentAllReals[i].value)
					{
						shouldPush = false
					}
				}

				if (shouldPush)
					unsortedReals.push({token: currentAllReals[i], index: i})
			}

			// Removes the fake tokens that are already in sorted
			for (let i = 0; i < currentAllFakes?.length; i++)
			{
				let shouldPush = true

				for (let j = 0; j < currentSorted?.length; j++)
				{
					if (currentSorted[j].value == currentAllFakes[i].value)
					{
						shouldPush = false
					}
				}

				if (shouldPush)
					unsortedFakes.push({token: currentAllFakes[i], index: i + currentAllReals.length})
			}

			// Creates the tokens
			for (let key = 0, numReal = 0, numFake = 0, i = 0; i < currentTokenOrder?.length; i++)
			{
				let token = null
				let index = -1

				// Token is real
				if (currentTokenOrder[i] < currentAllReals.length)
				{
					for (let j = 0; j < unsortedReals.length; j++)
					{
						if (unsortedReals[j].index == currentTokenOrder[i])
						{
							token = unsortedReals[j].token
							index = numReal
							numReal++
							break
						}
					}
				}
				// Token is fake
				else
				{
					for (let j = 0; j < unsortedFakes.length; j++)
					{
						if (unsortedFakes[j].index == currentTokenOrder[i])
						{
							token = unsortedFakes[j].token
							index = numFake
							numFake++
							break
						}
					}
				}

				// Token is in sorted
				if (token == null)
					continue

				tokenList.push(<Token
						key={key}
						index={index}
						type={token?.legend}
						value={token?.value}
						pref={props.displayPref}
						status={token.status}
						fakeout={token.fakeout}>
					</Token>
				)

				key++
			}

		}
		else
		{

			tokenList = props.phrase?.map((token, index) => {

				return <Token
							key={index}
							index={index}
							type={token.legend}
							value={token.value}
							pref={props.displayPref}
							status={token.status}
							fakeout={token.fakeout}>
						</Token>
			})
		}

		return tokenList
	}

	let tokenList = getTokenList()

	let isLastQuestion = global.state.currentIndex == global.state.items.length - 1

	let currentResponseText = <span>You've sorted every item! When you're ready, select <strong>Check Answer</strong> to verify if it is correct.</span>

	console.log("-------------------------")
	console.log(currentCheckPref)
	console.log(currentAnswerVal)

	// Sets the feeback message
	if (currentCheckPref == "yes" && currentAnswerVal == "yes")
		currentResponseText = <span><strong>Correct!</strong> Nice work. You're ready to continue to the next question.</span>
	else if (currentCheckPref == "yes" && currentAnswerVal == "no")
		currentResponseText = <div className="response-text"><strong>Incorrect.</strong> That's not quite right.<br/> You have <strong>{maxChecks-currentChecksUsed}</strong> attempts left for this question.</div>
	else if (currentCheckPref == "no")
		currentResponseText = <span>You've sorted every item! When you're ready, select <strong>Next Question</strong> to continue.</span>
	else if (currentFakeoutPref == "yes" && currentCheckPref == "yes")
		currentResponseText = <span>You have <strong>{maxChecks-currentChecksUsed}</strong> attempts left for this question.</span>

	return(
		<section className={`token-drawer ${(props.phrase?.length == 0 || currentFakeoutPref == "yes") ? 'empty' : ''}`
			+ ` ${(currentCheckPref == "yes" && currentAnswerVal == "yes") ? 'correct' : ''}`
			+ ` ${(currentCheckPref == "yes" && currentAnswerVal == "no") ? 'incorrect' : ''}`
			+ ` ${(currentFakeoutPref == "yes") ? 'fakeout' : ''}`}>
			{tokenList}
			<div className='empty-section'>
				<div style={{display: (currentFakeoutPref == "no" || currentAnswerVal == "yes") ? 'inline' : 'none'}}>
					<span className='empty-message' style={{display: (isLastQuestion && displayLastText) ? 'none' : 'inline-block'}}>
						{currentResponseText}
					</span>
					<span className='empty-message' style={{display: (isLastQuestion && displayLastText) ? 'inline-block' : 'none'}}>
						You've sorted every item! Select <strong>Submit</strong> at the top-right for scoring or feel free to go back and adjust your answers.
					</span>
				</div>
				<div style={{display: currentFakeoutPref == "yes" && currentAnswerVal != "yes" ? 'inline' : 'none'}}>
					<span className='empty-message' style={{display: (isLastQuestion && displayLastText) ? 'none' : 'inline-block'}}>
						{currentResponseText}
					</span>
				</div>
				<button onClick={paginate} style={{display: (isLastQuestion || (currentCheckPref == "yes" && currentChecksUsed == 0)) ? 'none' : 'inline-block'}}>Next Question</button>
				<button onClick={handleCheck}
					className= {
						`check-btn ${(currentAnswerVal == "yes" || currentChecksUsed >= maxChecks) ? "disabled" : ""}`
						+ ` ${currentCheckPref == "yes" ? "show" : ""}`
				}>
				{`${currentChecksUsed > 0 ? "Check Again" : "Check"}`}</button>
			</div>
		</section>
	)
}

export default TokenDrawer
