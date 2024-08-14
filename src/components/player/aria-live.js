import React, { useContext, useEffect, useRef, useState } from 'react'
import { store, DispatchContext } from '../../player-store'

const AriaLive = (props) => {

	const state = useContext(store)
	// TODO update this pls
    const [text, setText] = useState(state.liveRegion)


    useEffect(() => {
        setText(state.liveRegion)
    }, [state.liveRegion])

	return (
		<div
        id='aria-live-region'
        aria-live="assertive"
        role="region">
			<p>{text}</p>
		</div>
	)

}

export default AriaLive
