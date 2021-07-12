import React from 'react'
import renderer from 'react-test-renderer'
import CreatorBankModal from '../../../components/creator/creator-bank-modal'
import { StateProvider } from '../../../creator-store'

describe('Creator Bank Modal', () => {

	test('Creator Bank Modal component', () => {
		const component = renderer.create(
			<StateProvider>
				<CreatorBankModal
					enableQuestionBank={false}
					numAsk={1}
					questionCount={1} />
			</StateProvider>
		)
		const tree = component.toJSON()
	
		expect(tree).toMatchSnapshot()
	})

	test('Question bank is disabled by default', () => {
		const component = renderer.create(
			<StateProvider>
				<CreatorBankModal
					enableQuestionBank={false}
					numAsk={1}
					questionCount={1} />
			</StateProvider>
		)

		const providerEl = component.root

		const prefSelectInputs = providerEl.findAllByProps({ name: 'question-bank-toggle' })
		expect(prefSelectInputs[0].props.value).toBe(true)
		expect(prefSelectInputs[0].props.checked).toBe(false)
		expect(prefSelectInputs[1].props.checked).toBe(true)
		expect(providerEl.findByProps({ className: 'check-select select-wrapper disabled'})).toBeTruthy()

	})

	test('Question bank is properly enabled with relevant props', () => {
		const component = renderer.create(
			<StateProvider>
				<CreatorBankModal
					enableQuestionBank={true}
					numAsk={3}
					questionCount={4} />
			</StateProvider>
		)

		const providerEl = component.root

		const prefSelectInputs = providerEl.findAllByProps({ name: 'question-bank-toggle' })
		expect(prefSelectInputs[0].props.checked).toBe(true)
		expect(prefSelectInputs[1].props.checked).toBe(false)

		expect(providerEl.findByProps({ className: 'check-select select-wrapper '})).toBeTruthy()
		
		expect(providerEl.findByProps({ className: 'num-ask' }).props.disabled).toBe(false)
		expect(providerEl.findByProps({ className: 'num-ask' }).props.value).toBe(3)
	})

})