import React from 'react'
import LegendItem from './legend-item'

export default class Legend extends React.Component {
	constructor(props) {
		super(props)

		this.addLegendItem = this.addLegendItem.bind(this)
	}

	renderLegendItems() {
		const items = []

		for (let i = 0; i < this.props.items.length; i++) {
			const item = this.props.items[i]
			items.push(<LegendItem key={i} color={item.color} name={item.name} index={i} handleRemoveLegendItem={this.props.handleRemoveLegendItem}></LegendItem>)
		}
		return items
	}

	addLegendItem() {
		this.props.handleAddLegendItem()
	}

	render() {
		return (
			<section className="legend">
				<header>Legend</header>
				{this.renderLegendItems()}
				<button className="addNew" onClick={this.addLegendItem}>+ Add Another</button>
			</section>
		)
	}
}