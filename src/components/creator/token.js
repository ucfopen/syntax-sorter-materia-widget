import React from 'react'

export default class Token extends React.Component {
	constructor(props) {
		super(props)

		this.getLegendColor = this.getLegendColor.bind(this)
		this.openTokenSelection = this.openTokenSelection.bind(this)
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
		this.props.handleRequestTokenSelection(this.props.index)
	}

	render() {
		return (
			<span className={`token ${!this.props.type ? "unassigned" : ""} ${this.props.selected ? "selected" : ""}`}
				style={{background: this.getLegendColor(this.props.type)}}
				onClick={this.openTokenSelection}>{decodeURIComponent(this.props.value)}</span>
		)
	}
}