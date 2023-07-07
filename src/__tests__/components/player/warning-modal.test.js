import React from 'react'
import renderer, { act } from 'react-test-renderer'
import WarningModal from '../../../components/player/warning-modal'
import TestComponent from '../../../components/player/test-component'
import  { StateProvider } from '../../../player-store'

describe('Warning Modal', () => {
	test('Warning Modal Component', () => {
		const component = renderer.create(
			<StateProvider>
				<TestComponent
					dispatchType={'toggle_warning'}
					dispatchPayload={{}}>
					<WarningModal
						submitForScoring={jest.fn()}
						requireAllQuestions={false}>
					</WarningModal>
				</TestComponent>
			</StateProvider>
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Warning modal should be visible when toggled on', () => {
		const component = renderer.create(
			<StateProvider>
				<TestComponent
					dispatchType={'toggle_warning'}
					dispatchPayload={{}}>
					<WarningModal
						submitForScoring={jest.fn()}
						requireAllQuestions={false}>
					</WarningModal>
				</TestComponent>
			</StateProvider>
		)

		const providerEl = component.root
		expect(providerEl.findByProps({ className: 'warning-wrapper'}).props.style).toEqual({ display: 'flex'})
	})

	test('Warning modal should confirm submission when requireAll is false', () => {
		const component = renderer.create(
			<StateProvider>
				<TestComponent
					dispatchType={'toggle_warning'}
					dispatchPayload={{}}>
					<WarningModal
						submitForScoring={jest.fn()}
						requireAllQuestions={false}>
					</WarningModal>
				</TestComponent>
			</StateProvider>
		)

		const providerEl = component.root
		expect(providerEl.findAllByType('h3')[1].children[0]).toBe('Are you sure you want to submit?')
	})

	test('Warning modal should prevent submission when requireAll is true', () => {
		const component = renderer.create(
			<StateProvider>
				<TestComponent
					dispatchType={'toggle_warning'}
					dispatchPayload={{}}>
					<WarningModal
						submitForScoring={jest.fn()}
						requireAllQuestions={true}>
					</WarningModal>
				</TestComponent>
			</StateProvider>
		)

		const providerEl = component.root
		expect(providerEl.findAllByType('h3')[1].children[0]).toBe('Please answer all questions before submitting.')
	})

})