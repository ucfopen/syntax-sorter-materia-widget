import React from 'react'
import renderer from 'react-test-renderer'
import LegendColorPicker from '../../../components/creator/legend-color-picker'
import { StateProvider } from '../../../creator-store'

import 'jest-canvas-mock'

describe('Legend Color Picker', () => {

	test('Legend Color Picker component', () => {
		const component = renderer.create(
			<StateProvider>
				<LegendColorPicker
					handleColorChangeComplete={jest.fn()}
					handleClose={jest.fn()}
					color={'#FF0000'}
					visible={true}
					offset={0}></LegendColorPicker>
			</StateProvider>
		)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})