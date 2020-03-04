import React, { useContext } from 'react'
import LegendItem from './legend-item'
import { store } from '../../creator-store'

const Legend = (props) => {

	const global = useContext(store)
	const dispatch = global.dispatch

	const colorSelectIndex = global.state.devColorSelectIndex
	const colors = ['#00FF00', '#0000FF', '#ffd900', '#6200ff', '#00fff2', '#ff0080'] // TODO: color picker, not hard-coded values
	
	let legendItems = props.legend.map((item, index) => {
		return <LegendItem key={index} color={item.color} name={item.name} id={item.id} index={index} handleRemoveLegendItem={{}} handleEditLegendItem={{}}></LegendItem>
	})

	const addLegendItem = () => {
		dispatch({type: 'add_legend_item', payload: {text: '', color: colors[colorSelectIndex]}})
	}

	return (
		<section className={`legend ${props.show ? "show" : ""}`}>
			<header>Legend</header>
			{legendItems}
			<button className="addNew" onClick={addLegendItem}>+ Add Another</button>
			<button className="doneBtn" onClick={props.toggle}>Done</button>
		</section>
	)	
}

export default Legend