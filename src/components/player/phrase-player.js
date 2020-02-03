import React from 'react'
import ReactDOM from 'react-dom'
import TokenDrawer from './token-drawer'
import Token from './token'

export default class PhrasePlayer extends React.Component {
	constructor(props) {
		super(props)

		this.handleTokenDragOver = this.handleTokenDragOver.bind(this)
		this.handleTokenDrop = this.handleTokenDrop.bind(this)
		this.renderOrderedTokens = this.renderOrderedTokens.bind(this)
	}

	handleTokenDragOver(event) {
		event.preventDefault()

		const cursor = event.clientX

		let leftToken = null
		let rightToken = null

		for (let i=0; i<this.props.phraseList[this.props.currentIndex].sorted.length; i++) {
			let pos = this.props.phraseList[this.props.currentIndex].sorted[i].position
			let left = pos.x
			let right = pos.x + pos.width

			if (cursor > left) {
				if (!leftToken || (leftToken && left > leftToken.position.x)) {
					leftToken = this.props.phraseList[this.props.currentIndex].sorted[i]
					leftToken.index = i
				}
			}
			else if (cursor < right) {
				if (!rightToken || (rightToken && right < rightToken.position.x + rightToken.position.width)) {
					rightToken = this.props.phraseList[this.props.currentIndex].sorted[i]
					rightToken.index = i
				}
			}
		}

		this.props.manageAdjacentTokenDisplay(leftToken, rightToken)
	}

	handleTokenDrop(event) {
		event.preventDefault()
		let dropTokenName = event.dataTransfer.getData("tokenName")
		let dropTokenType = event.dataTransfer.getData("tokenType")
		let dropTokenPhraseIndex = event.dataTransfer.getData("tokenPhraseIndex")

		let index = this.props.phraseList[this.props.currentIndex].sorted.length

		for (let i = 0; i<this.props.phraseList[this.props.currentIndex].sorted.length; i++) {
			if (this.props.phraseList[this.props.currentIndex].sorted[i].arrangement == "left") {
				index = i + 1
			}
			else if (this.props.phraseList[this.props.currentIndex].sorted[i].arrangement == "right") {
				index = i > 0 ? i : 0
			}
		}

		console.log("drop index is " + index)

		let token = {legend: dropTokenType, value: dropTokenName, phraseIndex: dropTokenPhraseIndex}

		this.props.manageTokenArrangement(this.props.currentIndex, index, "add", token)

		this.props.manageAdjacentTokenDisplay(null, null)
	}

	renderOrderedTokens() {
		let tokens = []

		if ( !this.props.phraseList[this.props.currentIndex]) return []

		for (let i = 0; i < this.props.phraseList[this.props.currentIndex].sorted.length; i++) {
			// console.log(this.props.phraseList[this.props.currentIndex].sorted)
			tokens.push(<Token
							key={i}
							index={i}
							type={this.props.phraseList[this.props.currentIndex].sorted[i].legend}
							value={this.props.phraseList[this.props.currentIndex].sorted[i].value}
							status={this.props.phraseList[this.props.currentIndex].sorted[i].status}
							arrangement={this.props.phraseList[this.props.currentIndex].sorted[i].arrangement}
							legend={this.props.legend}
							report={this.props.manageTokenReport}
							position={this.props.phraseList[this.props.currentIndex].sorted[i].position}>
						</Token>)
		}

		// return tokens
		// this.setState({renderedTokens: tokens})
		return tokens
	}

	render() {
		return(
			<section className="phrase-player">
				<div className="token-container">
					<div className="token-target" onDragOver={this.handleTokenDragOver} onDrop={this.handleTokenDrop}>
						{this.renderOrderedTokens()}
						{ this.props.phraseList[this.props.currentIndex] && !this.props.phraseList[this.props.currentIndex].sorted.length ? "Drag and drop the words below to arrange them." : ""}
					</div>
				</div>
				<TokenDrawer
					phraseList={this.props.phraseList}
					currentIndex={this.props.currentIndex}
					manageTokenReport={this.manageTokenReport}
					legend={this.props.legend}></TokenDrawer>

			</section>
		)
	}
}