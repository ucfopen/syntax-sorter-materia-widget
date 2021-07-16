import { act } from '@testing-library/react-hooks'
import React from 'react'
import renderer from 'react-test-renderer'
import LegendItem from '../../../components/creator/legend-item'
import { StateProvider } from '../../../creator-store'

import 'jest-canvas-mock'

describe('Legend Item', () => {
	test('Legend Item component', () => {
		const component = renderer.create(
			<StateProvider>
				<LegendItem
					key={0}
					name={'test item'}
					id={1}
					index={0}
					toggleColorPicker={jest.fn()}
					focus={false}
					addLegendItem={jest.fn()}></LegendItem>
			</StateProvider>
		)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('It changes the legend item value', () => {
		const component = renderer.create(
			<StateProvider>
				<LegendItem
					key={0}
					index={0}
					toggleColorPicker={jest.fn()}
					focus={false}
					addLegendItem={jest.fn()}></LegendItem>
			</StateProvider>
		)
		const providerEl = component.root
		let inputEl = providerEl.findByType('input')

		expect(inputEl.props.value).toBe('Part of Speech')

		act(() => {
			inputEl.props.onChange({ target: { value: 'Updated Legend Item'}})
		})

		inputEl = providerEl.findByType('input')
		expect(inputEl.props.value).toBe('Updated Legend Item')
	})

	test('It requests to add another legend item', () => {

		const mockAddItem = jest.fn()

		const component = renderer.create(
			<StateProvider>
				<LegendItem
					key={0}
					index={0}
					toggleColorPicker={jest.fn()}
					focus={false}
					addLegendItem={mockAddItem}></LegendItem>
			</StateProvider>
		)
		const providerEl = component.root
		let inputEl = providerEl.findByType('input')

		act(() => {
			inputEl.props.onKeyDown({ which: 13 })
		})

		expect(mockAddItem).toHaveBeenCalled()
	})
})