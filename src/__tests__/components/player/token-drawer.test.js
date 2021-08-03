import React from 'react'
import renderer from 'react-test-renderer'
import TokenDrawer from '../../../components/player/token-drawer'
import Token from '../../../components/player/token'
import TestComponent from '../../../components/player/test-component'
import  { StateProvider } from '../../../player-store'


describe('Token Drawer', () => {
	test('Token Drawer component', () => {
		const phrase = [
			{
				value: 'This',
				legend: 1,
				status: 'unsorted',
				fakeout: false,
				id: 0
			},
			{
				value: 'is',
				legend: 2,
				status: 'unsorted',
				fakeout: false,
				id: 1
			},
			{
				value: 'a',
				legend: 1,
				status: 'unsorted',
				fakeout: false,
				id: 2
			},
			{
				value: 'test',
				legend: 1,
				status: 'unsorted',
				fakeout: false,
				id: 3
			},
		]

		const component = renderer.create(
			<StateProvider>
				<TestComponent>
					<TokenDrawer 
						phrase={phrase}
						empty={true}
						displayPref={'word'}
						attemptsUsed={0}
						attemptLimit={3}
						hasFakes={0}
						responseState={'none'}>
					</TokenDrawer>
				</TestComponent>
			</StateProvider>
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Token drawer in default state', () => {
		const phrase = [
			{
				value: 'This',
				legend: 1,
				status: 'unsorted',
				fakeout: false,
				id: 0
			},
			{
				value: 'is',
				legend: 2,
				status: 'unsorted',
				fakeout: false,
				id: 1
			},
			{
				value: 'a',
				legend: 1,
				status: 'unsorted',
				fakeout: false,
				id: 2
			},
			{
				value: 'test',
				legend: 1,
				status: 'unsorted',
				fakeout: false,
				id: 3
			},
		]

		const component = renderer.create(
			<StateProvider>
				<TestComponent>
					<TokenDrawer 
						phrase={phrase}
						empty={true}
						displayPref={'word'}
						attemptsUsed={0}
						attemptLimit={3}
						hasFakes={0}
						responseState={'none'}>
					</TokenDrawer>
				</TestComponent>
			</StateProvider>
		)

		const providerEl = component.root
		expect(providerEl.findByProps({ className: 'token-drawer none '})).toBeTruthy()
		expect(providerEl.findByProps({ className: 'verify show'})).toBeTruthy()

		const tokens = providerEl.findAllByType(Token)
		expect(tokens.length).toBe(4)
		expect(tokens[0].props.value).toBe('This')
		expect(providerEl.findAllByProps({ status: 'sorted' }).length).toBe(0)
	})

	test('Token drawer displays ready check answer controls', () => {
		const phrase = [
			{
				value: 'This',
				legend: 1,
				status: 'sorted',
				fakeout: false,
				id: 0
			},
			{
				value: 'is',
				legend: 2,
				status: 'sorted',
				fakeout: false,
				id: 1
			},
			{
				value: 'a',
				legend: 1,
				status: 'sorted',
				fakeout: false,
				id: 2
			},
			{
				value: 'test',
				legend: 1,
				status: 'sorted',
				fakeout: false,
				id: 3
			},
		]

		const component = renderer.create(
			<StateProvider>
				<TestComponent>
					<TokenDrawer 
						phrase={phrase}
						empty={true}
						displayPref={'word'}
						attemptsUsed={0}
						attemptLimit={3}
						hasFakes={0}
						responseState={'ready'}>
					</TokenDrawer>
				</TestComponent>
			</StateProvider>
		)

		const providerEl = component.root

		expect(providerEl.findByProps({ className: 'controls-message'})).toBeTruthy()
		expect(providerEl.findByProps({ className: 'verify show'})).toBeTruthy()
		expect(providerEl.findByProps({ className: 'paginate show'})).toBeTruthy()
	})

	test('Token drawer appropriately displays additional info when fakes are present', () => {
		const phrase = [
			{
				value: 'This',
				legend: 1,
				status: 'unsorted',
				fakeout: false,
				id: 0
			},
			{
				value: 'is',
				legend: 2,
				status: 'unsorted',
				fakeout: false,
				id: 1
			},
			{
				value: 'a',
				legend: 1,
				status: 'unsorted',
				fakeout: false,
				id: 2
			},
			{
				value: 'test',
				legend: 1,
				status: 'unsorted',
				fakeout: false,
				id: 3
			},
			{
				value: 'fake!',
				legend: 2,
				status: 'unsorted',
				fakeout: true,
				id: 3
			}
		]

		const component = renderer.create(
			<StateProvider>
				<TestComponent>
					<TokenDrawer 
						phrase={phrase}
						empty={true}
						displayPref={'word'}
						attemptsUsed={0}
						attemptLimit={3}
						hasFakes={1}
						responseState={'none'}>
					</TokenDrawer>
				</TestComponent>
			</StateProvider>
		)

		const providerEl = component.root
		expect(providerEl.findByProps({ className: 'token-drawer none has-fakes '})).toBeTruthy()
	})
})