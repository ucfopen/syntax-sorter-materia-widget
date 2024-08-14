import React from 'react'
import ReactDOM from 'react-dom'
import PlayerApp from './components/player/player-app'
import {StateProvider} from './player-store'
import './player.scss'

if (process.env.NODE_ENV !== 'production') {
	import('axe-core').then(axe => {
		axe.run().then(results => {
			console.log(results)
		})
	})
}

Materia.Engine.start({
	start: (instance, qset) => {
		ReactDOM.render(
			<StateProvider>
				<PlayerApp title={instance.name} qset={qset}/>
			</StateProvider>,
			document.getElementById(`root`)
		)
	}
})