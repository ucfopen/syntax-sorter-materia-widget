import React from 'react'
import Token from './token'

const TokenDrawer = (props) => {

	let tokenList = props.phrase?.map((token, index) => {
		return <Token
					key={index}
					index={index}
					type={token.legend}
					value={token.value}
					pref={props.displayPref}
					status={token.status}>
				</Token>
	})

	return(
		<section className="token-drawer">
			{tokenList}
		</section>
	)
}

export default TokenDrawer