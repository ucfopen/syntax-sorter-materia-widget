import React from 'react'
import renderer from 'react-test-renderer'
import PrefSelect from '../../../components/creator/pref-select'
import { StateProvider } from '../../../creator-store'
import { act } from '@testing-library/react-hooks'

describe('PrefSelect modal', () => {
	test('Pref Select component', () => {
		const component = renderer.create(
			<StateProvider>
				<PrefSelect />
			</StateProvider>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('By Word is selected when determined by props', () => {
		const component = renderer.create(
			<StateProvider>
				<PrefSelect displayPref='word' />
			</StateProvider>
		)

		const providerEl = component.root
		const prefSelectEl = providerEl.findByType(PrefSelect)

		expect(prefSelectEl.findByProps({value: 'word'}).props.checked).toBe(true)
		expect(prefSelectEl.findByProps({value: 'legend'}).props.checked).toBe(false)
	})

	test('By Legend is selected when determined by props', () => {
		const component = renderer.create(
			<StateProvider>
				<PrefSelect displayPref='legend'/>
			</StateProvider>
		)

		const providerEl = component.root
		const prefSelectEl = providerEl.findByType(PrefSelect)

		expect(prefSelectEl.findByProps({value: 'word'}).props.checked).toBe(false)
		expect(prefSelectEl.findByProps({value: 'legend'}).props.checked).toBe(true)
	})
})