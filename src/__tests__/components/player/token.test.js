import React from 'react'
import renderer, { act } from 'react-test-renderer'
import Token from '../../../components/player/token'
import TestComponent from '../../../components/player/test-component'
import  { StateProvider } from '../../../player-store'

describe('Token', () => {
	test('Token Component', () => {
		const component = renderer.create(
			<StateProvider>
				<TestComponent>
					<Token 
						id={0}
						key={0}
						index={0}
						type={2}
						value={'Test'}
						pref={'word'}
						status={'unsorted'}
						fakeout={false}
						dragEligible={true}>
					</Token>
				</TestComponent>
			</StateProvider>
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Has appropriate styles applied', () => {
		const component = renderer.create(
			<StateProvider>
				<TestComponent>
					<Token 
						id={0}
						key={0}
						index={0}
						type={2}
						value={'Test'}
						pref={'word'}
						status={'unsorted'}
						fakeout={false}
						dragEligible={true}>
					</Token>
				</TestComponent>
			</StateProvider>
		)

		const providerEl = component.root
		const tokenEl = providerEl.findByProps({ className: 'token   '})
		expect(tokenEl.props.style).toEqual({ background: '#00FF00', color: '#ffffff', display: 'inline-block' })
	})
})