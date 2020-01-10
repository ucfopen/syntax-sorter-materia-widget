import React from 'react'

export default class LegendItem extends React.Component {
	constructor(props) {
		super(props)

		this.remove = this.remove.bind(this, this.props.index)
		this.onNameChange = this.onNameChange.bind(this)
	}

	onNameChange(event) {
		this.props.handleEditLegendItem(this.props.index, event.target.value, this.props.color)
		console.log(event.target.value)
	}

	remove(index) {
		this.props.handleRemoveLegendItem(index)
	}

	render() {
		return (
			<div className="legend-item">
				<div className="item-color" style={{backgroundColor: this.props.color }}></div>
				<input value={this.props.name} onChange={this.onNameChange} placeholder='Legend Value'></input>
				<button className="remove-item" onClick={this.remove}>X</button>
			</div>
		)
	}
}