import React from 'react'

const Token = (props) => {

	return (
		<div className='token' style={{background: props.color}}>
			{props.value}
		</div>
	)
}

export default Token