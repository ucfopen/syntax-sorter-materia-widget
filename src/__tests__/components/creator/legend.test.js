import React from 'react'
import renderer from 'react-test-renderer'
import Legend from '../../../components/creator/legend'
import LegendItem from '../../../components/creator/legend-item'
import LegendColorPicker from '../../../components/creator/legend-color-picker'
import  { StateProvider } from '../../../creator-store'
import { act } from '@testing-library/react-hooks'

// required to keep references to useContext from failing
import 'jest-canvas-mock'

describe('Legend', () => {

	test('Legend component', () => {

		const component = renderer.create(
			<StateProvider>
				<Legend show={true} />
			</StateProvider>
		)

		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Should add a legend item', () => {

		const component = renderer.create(
			<StateProvider>
				<Legend show={true} />
			</StateProvider>
		)

		const providerEl = component.root
		const legendEl = providerEl.findByType(Legend)

		let items = legendEl.findAllByType(LegendItem)
		expect(items.length).toBe(1)

		const buttons = legendEl.findAllByType('button')
		
		buttons.forEach((button) => {

			if (button.props.className && button.props.className == 'addNew'){
				act(() => {
					button.props.onClick()
				})
			}
		})

		items = legendEl.findAllByType(LegendItem)

		expect(items.length).toBe(2)
	})

	test('Should remove a legend item', () => {

		const component = renderer.create(
			<StateProvider>
				<Legend show={true} />
			</StateProvider>
		)

		const providerEl = component.root
		const legendEl = providerEl.findByType(Legend)

		const buttons = legendEl.findAllByType('button')
		
		buttons.forEach((button) => {

			if (button.props.className && button.props.className == 'remove-item'){
				act(() => {
					button.props.onClick()
				})
			}
		})

		let items = legendEl.findAllByType(LegendItem)

		expect(items.length).toBe(0)
	})

	test('Color picker opens when selected and selects a color', () => {

		const component = renderer.create(
			<StateProvider>
				<Legend show={true} />
			</StateProvider>
		)

		const providerEl = component.root
		const legendEl = providerEl.findByType(Legend)

		const buttons = legendEl.findAllByType('button')
		
		buttons.forEach((button) => {

			if (button.props.className && button.props.className == 'item-color '){
				act(() => {
					button.props.onClick()
				})
			}
		})

		const colorPicker = legendEl.findByType(LegendColorPicker)
		expect(colorPicker.props.visible).toBe(true)
		expect(colorPicker.props.color).toBe('#FF0000')

		act(() => {
			colorPicker.props.handleColorChangeComplete({hex: '#00FF00'})
		})

		expect(colorPicker.props.color).toBe('#00FF00')
	})
	
})