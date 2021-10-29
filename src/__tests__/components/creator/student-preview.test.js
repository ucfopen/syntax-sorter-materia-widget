import React from 'react'
import renderer from 'react-test-renderer'
import StudentPreview from '../../../components/creator/student-preview'
import { StateProvider } from '../../../creator-store'

describe('Student Preview', () => {
	test('Student Preview component', () => {
		const component = renderer.create(
			<StateProvider>
				<StudentPreview />
			</StateProvider>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})
})