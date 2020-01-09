import React from 'react';

export default class PhraseBuilder extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<section className="phrase-builder">
				<header>Phrase to Complete</header>
				<p>{this.props.phrase}</p>
			</section>
		)
	}	
}