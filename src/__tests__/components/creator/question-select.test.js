import React from 'react'
import renderer from 'react-test-renderer'
import QuestionSelect from '../../../components/creator/question-select'
import { StateProvider } from '../../../creator-store'
import { act } from '@testing-library/react-hooks'

describe('QuestionSelect modal', () => {
	test('Question Select component', () => {
		const component = renderer.create(
			<StateProvider>
				<QuestionSelect />
			</StateProvider>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('It adds a new question', () => {
		const component = renderer.create(
			<StateProvider>
				<QuestionSelect />
			</StateProvider>
		)

		const providerEl = component.root
		const questionSelectEl = providerEl.findByType(QuestionSelect)

		const buttons = questionSelectEl.findAllByType('button')

		expect(questionSelectEl.findAllByProps({ className: 'select-btn selected'}).length).toBe(1)
		expect(questionSelectEl.findAllByProps({ className: 'select-btn '}).length).toBe(0)

		const button = questionSelectEl.findByProps({ className: 'select-btn add-new '})
		act(() => {
			button.props.onClick()
		})

		expect(questionSelectEl.findAllByProps({ className: 'select-btn '}).length).toBe(1)
	})

	test('It creates 9 additional questions', () => {
		const component = renderer.create(
			<StateProvider>
				<QuestionSelect />
			</StateProvider>
		)

		const providerEl = component.root
		const questionSelectEl = providerEl.findByType(QuestionSelect)

		const addQuestionButton = questionSelectEl.findByProps({ className: 'select-btn add-new '})

		// adds nine questions
		for (let i=0; i<9; i++) {
			act(() => {
				addQuestionButton.props.onClick()
			})
		}

		expect(questionSelectEl.findAllByProps({ className: 'select-btn '}).length).toBe(9)
		expect(questionSelectEl.findAllByProps({ className: 'select-btn selected'}).length).toBe(1)
	})

	test('It only displays a maximum of 9 items', () => {
		const component = renderer.create(
			<StateProvider>
				<QuestionSelect />
			</StateProvider>
		)

		const providerEl = component.root
		const questionSelectEl = providerEl.findByType(QuestionSelect)

		const addQuestionButton = questionSelectEl.findByProps({ className: 'select-btn add-new '})

		// adds 12 questions
		for (let i=0; i<12; i++) {
			act(() => {
				addQuestionButton.props.onClick()
			})
		}

		expect(questionSelectEl.findAllByProps({ className: 'select-btn '}).length).toBe(8)
		expect(questionSelectEl.findAllByProps({ className: 'select-btn selected'}).length).toBe(1)

		expect(questionSelectEl.findAllByProps({ className: 'select-btn paginate-up show '}).length).toBe(1)
		expect(questionSelectEl.findAllByProps({ className: 'select-btn paginate-down show disabled'}).length).toBe(1)
	})

	test('It selects a different question', () => {
		const component = renderer.create(
			<StateProvider>
				<QuestionSelect />
			</StateProvider>
		)

		const providerEl = component.root
		const questionSelectEl = providerEl.findByType(QuestionSelect)

		const addQuestionButton = questionSelectEl.findByProps({ className: 'select-btn add-new '})

		// adds 9 questions
		for (let i=0; i<9; i++) {
			act(() => {
				addQuestionButton.props.onClick()
			})
		}

		const pickAButton = questionSelectEl.findAllByProps({ className: 'select-btn '})[4]
		act(() => {
			pickAButton.props.onClick()
		})
		
		expect(questionSelectEl.findAllByProps({ className: 'select-btn selected'}).length).toBe(1)
	})
})