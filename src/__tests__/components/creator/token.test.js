import React from 'react'
import renderer from 'react-test-renderer'
import Token from '../../../components/creator/token'
import { StateProvider } from '../../../creator-store'

describe('Token', () => {

	test('Token component', () => {
		const component = renderer.create(
			<StateProvider>
				<Token
					key={0}
					index={0}
					type={1}
					value={'test token'}
					context='phrase' />
			</StateProvider>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('It is properly labelled unassigned with no legend selected', () => {
		const component = renderer.create(
			<StateProvider>
				<Token
					key={0}
					index={0}
					type={null}
					value={'test token'}
					context='phrase' />
			</StateProvider>
		)

		const providerEl = component.root
		const tokenEl = providerEl.findByType(Token)
		
		expect(tokenEl.findByProps({ className: 'token unassigned '})).toBeTruthy()

	})

	test('It is given the correct styling associated with its legend type', () => {
		const component = renderer.create(
			<StateProvider>
				<Token
					key={0}
					index={0}
					type={1}
					value={'test token'}
					context='phrase' />
			</StateProvider>
		)

		const providerEl = component.root
		const tokenEl = providerEl.findByType(Token)

		const token = tokenEl.findByProps({ className: 'token  '})
		
		expect(token).toBeTruthy()
		expect(token.props.style).toMatchObject({ background: '#FF0000', color: '#ffffff' })
	})
})