import React, { useContext, useState, useEffect } from 'react'
import  { store } from '../../player-store'

const TestComponent = (props) => {
	const manager = useContext(store)
	const dispatch = manager.dispatch

	const [state, setState] = useState({ didDispatch: false})

	const _title = 'Player App Test Title'
	const _qset = {
		items: [
			{
				questions: [{ text: 'Test Question Text 1'}],
				answers: [{ 
					text: 'This is a test',
					options: {
						phrase: [
							{
								value: 'This',
								legend: 1
							},
							{
								value: 'is',
								legend: 2
							},
							{
								value: 'a',
								legend: 1
							},
							{
								value: 'test',
								legend: 2
							}
						]
					}
				}],
				options: {
					displayPref: 'word',
					attempts: '1',
					hint: 'Test Question Hint',
					fakes: []
				}
			},
			{
				questions: [{ text: 'Test Question Text 2'}],
				answers: [{ 
					text: 'This is another test',
					options: {
						phrase: [
							{
								value: 'This',
								legend: 1
							},
							{
								value: 'is',
								legend: 2
							},
							{
								value: 'another',
								legend: 1
							},
							{
								value: 'test',
								legend: 2
							}
						]
					}
				}],
				options: {
					displayPref: 'legend',
					attempts: '3',
					hint: 'Test Question Hint',
					fakes: []
				}
			}
		],
		options: {
			legend: [
				{
					id: 1,
					color: '#FF0000',
					name: 'Test noun',
					focus: false
				},
				{
					id: 2,
					color: '#00FF00',
					name: 'Test verb',
					focus: false
				}
			],
			enableQuestionBank: false,
			requireAllQuestions: true,
			numAsk: 1
		}
	}

	useEffect(() => {
		if (manager.state.requireInit) {
			dispatch({
				type: 'init', payload: {
					qset: _qset,
					title: _title
				}
			})
		}
	}, [manager.state.requireInit])

	useEffect(() => {
		if ( state.didDispatch == false && props.dispatchType && props.dispatchPayload ) {
			dispatch({
				type: props.dispatchType,
				payload: props.dispatchPayload
			})

			setState(state => ({ ...state, didDispatch: true }))
		}
	})

	return (
		<span className='test-component'>{props.children}</span>
	)
}

export default TestComponent