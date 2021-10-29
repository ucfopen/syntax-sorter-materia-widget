import React from 'react'
import renderer from 'react-test-renderer'
import PlayerApp from '../../../components/player/player-app'
import  { StateProvider } from '../../../player-store'

describe('Player Application', () => {

	const title = 'Player App Test Title'
	const _qset = {
		items: [
			{
				questions: [{ text: 'Test Question Text 1'}],
				answers: [{ 
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

	test('Player App component', () => {
		const component = renderer.create(
			<StateProvider>
				<PlayerApp title={title} qset={_qset} />
			</StateProvider>
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})