import React from 'react'
import renderer from 'react-test-renderer'
import CreatorErrorModal from '../../../components/creator/creator-error-modal'
import { StateProvider } from '../../../creator-store'

describe('Creator Error Modal', () => {
	test('Creator Error Modal component', () => {
		const component = renderer.create(
			<StateProvider>
				<CreatorErrorModal></CreatorErrorModal>
			</StateProvider>
		)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})