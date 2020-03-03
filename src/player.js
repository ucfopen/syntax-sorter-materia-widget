import React from 'react'
import ReactDOM from 'react-dom'
import PlayerApp from './components/player/player-app'
import {StateProvider} from './player-store'

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