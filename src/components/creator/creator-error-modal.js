import React, {useContext} from 'react'
import { store } from '../../creator-store'

const CreatorErrorModal = (props) => {

  const global = useContext(store)
  const dispatch = global.dispatch

  const currentErrorMessage = global.state ? global.state.errorMsg : ""
  const currentError = global.state ? global.state.showErrorModal : false

  const dismiss = () => {
    dispatch({
      type: 'toggle_error_modal',
      payload: {
        error: ""
      }
    })
  }

  return (
    <div className='modal-wrapper' style={{display: currentError ? 'block' : 'none'}}>
      <div className='modal creator'>
        <h3>Error</h3>
        <h4>{currentErrorMessage}</h4>
        <button onClick={dismiss}>Okay</button>
      </div>
      <div className='modal-bg'></div>
    </div>
  )
}

export default CreatorErrorModal
