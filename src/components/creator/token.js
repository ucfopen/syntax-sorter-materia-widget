import React from 'react'

export default class Token extends React.Component {
	constructor(props) {
		super(props)

		this.getLegendColor = this.getLegendColor.bind(this)
		this.openTokenSelection = this.openTokenSelection.bind(this)

		// this.state = {
		// 	selected: false
		// }
	}

	getLegendColor(name) {
		if (!name) return '#ffffff'

		for (const term of this.props.legend) {
			if (term.name.toLowerCase() == name.toLowerCase()) {
				return term.color
			}			
		}
	}

	openTokenSelection() {
		// this.setState({selected: true})
		this.props.handleRequestTokenSelection(this.props.index)
	}

	render() {
		return (
			<span className={`token ${!this.props.type ? "unassigned" : ""} ${this.props.selected ? "selected" : ""}`}
				style={{background: this.getLegendColor(this.props.type)}}
				onClick={this.openTokenSelection}>{this.props.value}</span>
		)
	}
}