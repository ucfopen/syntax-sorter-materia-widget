import React from 'react'
import renderer from 'react-test-renderer'
import CreatorFakeoutModal from '../../../components/creator/creator-fakeout-modal'
import { StateProvider } from '../../../creator-store'

describe('Creator Fakeout Modal', () => {
	test('Creator Fakeout Modal component', () => {
		const component = renderer.create(
			<StateProvider>
				<CreatorFakeoutModal></CreatorFakeoutModal>
			</StateProvider>
		)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})