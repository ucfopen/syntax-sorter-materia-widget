import React from 'react'
import renderer, { act } from 'react-test-renderer'
import CreatorHintsModal from '../../../components/creator/creator-hints-modal'
import { StateProvider } from '../../../creator-store'

describe('Creator Hints Modal', () => {
	test('Creator Hints Modal component', () => {
		const component = renderer.create(
			<StateProvider>
				<CreatorHintsModal></CreatorHintsModal>
			</StateProvider>
		)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Attempts are properly updated', () => {
		const component = renderer.create(
			<StateProvider>
				<CreatorHintsModal></CreatorHintsModal>
			</StateProvider>
		)

		const providerEl = component.root
		expect(providerEl.findByProps({ name: 'check-val' }).props.value).toBe(1)
		expect(providerEl.findByProps({ className: 'select-wrapper disabled'})).toBeTruthy()
		expect(providerEl.findByProps({ name: 'hint-val' }).props.disabled).toBe(true)

		act(() => {
			providerEl.findByProps({ name: 'check-val' }).props.onChange({ target: { value: 3}})
		})

		expect(providerEl.findByProps({ name: 'check-val' }).props.value).toBe(3)
		expect(providerEl.findByProps({ className: 'select-wrapper '})).toBeTruthy()

	})

	test('Hint box is properly enabled when attempts are > 1', () => {
		const component = renderer.create(
			<StateProvider>
				<CreatorHintsModal></CreatorHintsModal>
			</StateProvider>
		)

		const providerEl = component.root
		
		act(() => {
			providerEl.findByProps({ name: 'check-val' }).props.onChange({ target: { value: 3}})
		})

		expect(providerEl.findByProps({ name: 'check-val' }).props.value).toBe(3)
		expect(providerEl.findByProps({ className: 'select-wrapper '})).toBeTruthy()
		expect(providerEl.findByProps({ name: 'hint-val' }).props.disabled).toBe(false)
	})

	test('Hint text updates correctly', () => {
		const component = renderer.create(
			<StateProvider>
				<CreatorHintsModal></CreatorHintsModal>
			</StateProvider>
		)
		
		const providerEl = component.root
		const hintInput = providerEl.findByProps({ name: 'hint-val'})
		act(() => {
			hintInput.props.onChange({ target: { value: 'I have altered the hint text'}})
		})

		expect(providerEl.findByProps({ name: 'hint-val'}).props.value).toBe('I have altered the hint text')
	})
})