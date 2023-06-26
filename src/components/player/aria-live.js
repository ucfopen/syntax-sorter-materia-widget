import React, { useContext, useEffect, useRef, useState } from 'react'
import { store } from '../../player-store'

const AriaLive = (props) => {

	const manager = useContext(store)
    const dispatch = manager.dispatch
    const [text, setText] = useState(manager.state.liveRegion)


    useEffect(() => {
        setText(manager.state.liveRegion)
    }, [manager.state.liveRegion])

	return (
		<div
        id='aria-live-region'
        aria-live="polite"
        role="region">
			<p>{text}</p>
		</div>
	)

}

export default AriaLive
