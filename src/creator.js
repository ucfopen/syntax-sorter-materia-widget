import React from 'react'
import ReactDOM from 'react-dom'
import CreatorApp from './components/creator/creator-app'
import {StateProvider} from './creator-store'

const materiaCallbacks = {};
let creatorInstance;

materiaCallbacks.initNewWidget = (instance) => {
	materiaCallbacks.initExistingWidget(`New Foreign Language Widget`, instance, undefined, 1, true);
}

materiaCallbacks.initExistingWidget = (title, instance, _qset, version, newWidget = false) => {
	creatorInstance = ReactDOM.render(
		<StateProvider>
			<CreatorApp title={title} qset={_qset} performInit={ !newWidget } />
		</StateProvider>,
		document.getElementById(`root`)
	)
}

materiaCallbacks.onSaveClicked = () => {
	creatorInstance.onSaveClicked();
};

materiaCallbacks.onSaveComplete = () => true

Materia.CreatorCore.start(materiaCallbacks);