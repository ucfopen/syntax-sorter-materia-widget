import React from 'react'
import renderer, { act } from 'react-test-renderer'
import CreatorSubmissionSettingsModal from '../../../components/creator/creator-submission-settings-modal'
import { StateProvider } from '../../../creator-store'

describe('Creator Submission Settings Modal', () => {

	test('Creator Submission Settings component', () => {
		const component = renderer.create(
			<StateProvider>
				<CreatorSubmissionSettingsModal></CreatorSubmissionSettingsModal>
			</StateProvider>
		)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})
})