import React from 'react'
import ReactDOM from 'react-dom'
import Token from './token'

export default class TokenDrawer extends React.Component {
	constructor(props) {
		super(props)


		this.renderTokens = this.renderTokens.bind(this)
	}

	renderTokens() {

		if (!this.props.phraseList.length) return

		const phrase = this.props.phraseList[this.props.currentIndex].phrase
		const tokens = []
		
		for (let i = 0; i < phrase.length; i++) {
			tokens.push(
				<Token
					key={i}
					index={i}
					type={phrase[i].legend}
					value={phrase[i].value}
					legend={this.props.legend}
					status={phrase[i].status}
					report={this.props.manageTokenReport}>
				</Token>)
		}

		return tokens
	}

	render() {
		return(
			<section className="token-drawer">
				{this.renderTokens()}
			</section>
		)
	}
}