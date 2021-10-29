import { act } from '@testing-library/react-hooks'
import React from 'react'
import renderer from 'react-test-renderer'
import FakeoutBuilder from '../../../components/creator/fakeout-builder'
import Token from '../../../components/creator/token'
import { StateProvider } from '../../../creator-store'

describe('Fakeout Builder', () => {

	test('Fakeout Builder component', () => {
		const component = renderer.create(
			<StateProvider>
				<FakeoutBuilder></FakeoutBuilder>
			</StateProvider>
		)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('It inputs a token', () => {
		const component = renderer.create(
			<StateProvider>
				<FakeoutBuilder />
			</StateProvider>
		)

		const providerEl = component.root
		const tokenInput = providerEl.findByProps({ className: 'token-input'})

		act(() => {
			tokenInput.props.onKeyDown({which: 13, target: { value: 'antidisestablishmentarianism'}})
		})

		const tokens = providerEl.findAllByType(Token)
		expect(tokens[0].props.value).toBe('antidisestablishmentarianism')
		
	})

	test('It selects a legend type for the token', () => {
		const component = renderer.create(
			<StateProvider>
				<FakeoutBuilder />
			</StateProvider>
		)

		const providerEl = component.root
		const tokenInput = providerEl.findByProps({ className: 'token-input'})
		
		act(() => {
			tokenInput.props.onKeyDown({which: 13, target: { value: 'antidisestablishmentarianism'}})
		})

		const tokens = providerEl.findAllByType(Token)

		expect(tokens[0].props.type).toBeNull()

		let tokenSelect = tokens[0].findByType('span')

		act(() => {
			tokenSelect.props.onClick()
		})

		expect(tokenSelect.props.className).toBe('token unassigned selected')

		let inputs = providerEl.findAllByType('input')
		inputs.forEach((input) => {
			if (input.props.name && input.props.value == '1') {
				act(() => {
					input.props.onChange({target: { value: '1' }})
				})
			}
		})

		expect(tokens[0].props.value).toBe('antidisestablishmentarianism')
		expect(tokens[0].props.type).toBe(1)
	})

	test('It converts a token back into input', () => {
		const component = renderer.create(
			<StateProvider>
				<FakeoutBuilder />
			</StateProvider>
		)

		const providerEl = component.root
		const tokenInput = providerEl.findByProps({ className: 'token-input' })
		act(() => {
			tokenInput.props.onKeyDown({which: 13, target: { value: 'antidisestablishmentarianism'}})
		})

		let tokens = providerEl.findAllByType(Token)
		expect(tokens.length).toBe(1)

		act(() => {
			tokenInput.props.onKeyDown({which: 8, target: { value: ''}, preventDefault: jest.fn()})
		})

		tokens = providerEl.findAllByType(Token)
		expect(tokens.length).toBe(0)
	})

})