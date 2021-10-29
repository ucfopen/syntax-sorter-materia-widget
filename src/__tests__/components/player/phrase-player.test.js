import React from 'react'
import renderer from 'react-test-renderer'
import PhrasePlayer from '../../../components/player/phrase-player'
import TestComponent from '../../../components/player/test-component'
import  { StateProvider } from '../../../player-store'

describe('Phrase Player', () => {

	test('Phrase Player component', () => {

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
					<PhrasePlayer
						phrase={phrase}
						sorted={[]}
						displayPref={'word'}
						attemptsUsed={0}
						attemptLimit={1}
						hasFakes={0}
						responseState={'none'}></PhrasePlayer>
				</TestComponent>
			</StateProvider>
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Has the correct status classes based on props', () => {
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
					<PhrasePlayer
						phrase={phrase}
						sorted={[]}
						displayPref={'word'}
						attemptsUsed={0}
						attemptLimit={1}
						hasFakes={0}
						responseState={'none'}></PhrasePlayer>
				</TestComponent>
			</StateProvider>
		)
		
		const providerEl = component.root

		expect(providerEl.findByProps( {className : 'card phrase-player none '} )).toBeTruthy()
		expect(providerEl.findByProps( {className : 'token-container '} )).toBeTruthy()
		expect(providerEl.findByProps( {className : 'fakeout-tip '} )).toBeTruthy()
	})

	test('Displays fakeout tip when fake tokens are present', () => {
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
				id: 4
			}
		]

		const component = renderer.create(
			<StateProvider>
				<TestComponent>
					<PhrasePlayer
						phrase={phrase}
						sorted={[]}
						displayPref={'word'}
						attemptsUsed={0}
						attemptLimit={1}
						hasFakes={1}
						responseState={'none'}></PhrasePlayer>
				</TestComponent>
			</StateProvider>
		)
		
		const providerEl = component.root
		expect(providerEl.findByProps({ className: 'fakeout-tip show'})).toBeTruthy()
	})
})