import React from 'react'
import renderer from 'react-test-renderer'
import Question from '../../../components/creator/question'
import { StateProvider } from '../../../creator-store'
import { act } from '@testing-library/react-hooks'

describe('Question', () => {

	test('Question component', () => {
		const component = renderer.create(
			<StateProvider>
				<Question />
			</StateProvider>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Updates question value', () => {
		const component = renderer.create(
			<StateProvider>
				<Question />
			</StateProvider>
		)

		const providerEl = component.root
		const questionEl = providerEl.findByType(Question)

		expect(questionEl.findByType('input').props.value).toBe('')
		
		act(() => {
			questionEl.findByType('input').props.onChange({ target: { value: 'What is the airspeed velocity of an unladen swallow?'}})
		})

		expect(questionEl.findByType('input').props.value).toBe('What is the airspeed velocity of an unladen swallow?')
	})

})