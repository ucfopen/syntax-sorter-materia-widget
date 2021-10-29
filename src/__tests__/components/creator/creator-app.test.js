import React from 'react'
import renderer from 'react-test-renderer'
import CreatorApp from '../../../components/creator/creator-app'
import  { StateProvider } from '../../../creator-store'

import 'jest-canvas-mock'

describe('Creator Application', () => {

	const title = 'Creator App Test Title'
	const _qset = {
		items: [
			{
				questions: [{ text: 'Test Question Text 1'}],
				answers: [{ 
					options: { phrase: {} }
				}],
				options: {
					displayPref: 'word',
					attempts: '1',
					hint: 'Test Question Hint',
					fakes: {}
				}
			}
		]
	}

	const materiaCallbacks = {
		initNewWidget: jest.fn(),
		initExistingWidget: jest.fn()
	}

	test('Creator App component', () => {

		let newWidget = true
		
		const component = renderer.create(
			<StateProvider>
				<CreatorApp title={title} qset={_qset} newWidget={newWidget} callbacks={materiaCallbacks} />
			</StateProvider>
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})