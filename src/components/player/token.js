import React from 'react'
import ReactDOM from 'react-dom'

export default class Token extends React.Component {
	constructor(props) {
		super(props)

		this.tokenRef = React.createRef()

		this.state = {
			dragging: false
		}

		this.getLegendColor = this.getLegendColor.bind(this)
		this.handleDragStart = this.handleDragStart.bind(this)
		this.handleDrag = this.handleDrag.bind(this)
		this.handleDragEnd = this.handleDragEnd.bind(this)
	}

	getLegendColor(name) {
		if (!name) return '#ffffff'

		for (const term of this.props.legend) {
			if (term.name.toLowerCase() == name.toLowerCase()) {
				return term.color
			}
		}
	}

	handleDragStart(event) {
		
		event.dataTransfer.dropEffect = "move"
		event.dataTransfer.setData("tokenName",this.props.value)
		event.dataTransfer.setData("tokenType",this.props.type)
		event.dataTransfer.setData("tokenPhraseIndex",this.props.index)

		setTimeout(() => {
			this.setState({dragging: true})
		})
	}

	handleDrag(event) {
	}

	handleDragEnd(event) {

		console.log(event.clientX)

		setTimeout(() => {
			this.setState({dragging: false})
		})
	}

	componentDidMount() {
		if (this.props.status == "sorted") {
			const coords = this.tokenRef.current.getBoundingClientRect()
			this.props.report({
				type: "token-sorted",
				index: this.props.index,
				x: coords.x,
				width: coords.width
			})
		}
	}

	componentDidUpdate() {
		switch (this.props.status) {
			case 'sorted':
				const coords = this.tokenRef.current.getBoundingClientRect()

				// if current position is the same as the last recorded position - don't report
				// prevents infinite state cycle error
				if (this.props.position.x && this.props.position.x == coords.x) {
					return false
				}

				this.props.report({
					type: "token-sorted",
					index: this.props.index,
					x: coords.x,
					width: coords.width
				})
				break
			default:
				return false
		}
	}

	render() {
		return(
			<div className={`token ${this.state.dragging ? 'dragging' : ''} ${this.props.arrangement == 'left' ? 'is-left' : ''} ${this.props.arrangement == 'right' ? 'is-right' : ''}`}
				style={{
					background: this.getLegendColor(this.props.type),
					display: this.props.status == "relocated" ? "none" : "inline-block"
				}}
				ref={this.tokenRef}
				draggable
				onDragStart={this.handleDragStart}
				onDrag={this.handleDrag}
				onDragEnd={this.handleDragEnd}>
				{this.props.type}
			</div>
		)
	}
}