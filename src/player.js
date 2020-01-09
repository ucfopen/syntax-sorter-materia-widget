import React from 'react';
import ReactDOM from 'react-dom';

class PlayerApp extends React.Component {

	render() {
		return(
			<div>
				Hullo! I'm the Player.
			</div>
		)
	}
}


export default PlayerApp;

Materia.Engine.start({
	start: (instance, qset) => {
		ReactDOM.render(
			<PlayerApp />,
			document.getElementById(`root`)
		)
	}
})