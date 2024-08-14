import React from 'react'
import ReactDOM from 'react-dom'
import CreatorApp from './components/creator/creator-app'
import {StateProvider} from './creator-store'
import './creator.scss'

const materiaCallbacks = {}

materiaCallbacks.initNewWidget = (instance) => {
	materiaCallbacks.initExistingWidget(`New Foreign Language Widget`, instance, undefined, 1, true);
}

materiaCallbacks.initExistingWidget = (title, instance, _qset, version, newWidget = false) => {
	ReactDOM.render(
		<StateProvider>
			<CreatorApp title={title} qset={_qset} newWidget={newWidget} callbacks={materiaCallbacks} />
		</StateProvider>,
		document.getElementById(`root`)
	)
}

Materia.CreatorCore.start(materiaCallbacks)