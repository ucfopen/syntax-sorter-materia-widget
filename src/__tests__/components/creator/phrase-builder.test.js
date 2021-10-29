import React from 'react'
import renderer from 'react-test-renderer'
import PhraseBuilder from '../../../components/creator/phrase-builder'
import Token from '../../../components/creator/token'
import { StateProvider } from '../../../creator-store'
import { act } from '@testing-library/react-hooks'

describe('Phrase Builder', () => {
	
	test('Phrase Builder component', () => {
		const component = renderer.create(
			<StateProvider>
				<PhraseBuilder />
			</StateProvider>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('It inputs a token', () => {
		const component = renderer.create(
			<StateProvider>
				<PhraseBuilder />
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
				<PhraseBuilder />
			</StateProvider>
		)

		const providerEl = component.root
		const tokenInput = providerEl.findByProps({ className: 'token-input' })
			
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
				<PhraseBuilder />
			</StateProvider>
		)

		const providerEl = component.root
		const phraseBuilderEl = providerEl.findByType(PhraseBuilder)

		let inputs = phraseBuilderEl.findAllByType('input')

		inputs.forEach((input) => {

			if (input.props.className && input.props.className == 'token-input'){
				act(() => {
					input.props.onKeyDown({which: 13, target: { value: 'antidisestablishmentarianism'}})
				})
			}
		})

		let tokens = phraseBuilderEl.findAllByType(Token)
		expect(tokens.length).toBe(1)

		inputs.forEach((input) => {

			if (input.props.className && input.props.className == 'token-input'){
				act(() => {
					input.props.onKeyDown({which: 8, target: { value: ''}, preventDefault: jest.fn()})
				})

				tokens = phraseBuilderEl.findAllByType(Token)
				expect(tokens.length).toBe(0)
			}
		})
	})
})