import React, {useContext} from 'react'
import { store } from '../../creator-store'
import FakeoutBuilder from './fakeout-builder'

const CreatorFakeoutModal = (props) => {

  const global = useContext(store)
  const dispatch = global.dispatch

  const currentFakePref = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].fakeoutPref : 'no'
  const fakeout = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].fakeout : []

  const dismiss = () => {
    dispatch({type: 'toggle_fakeout_modal'})
  }

  const handleFakeoutPref = (event) => {
    dispatch({type: 'update_fakeout_pref', payload: {
      questionIndex: global.state.currentIndex,
      pref: event.target.value
    }})
  }

  const handleFakeout = (event) => {
    dispatch({type: 'update_fakeout', payload: {
      questionIndex: global.state.currentIndex,
      pref: event.target.value
    }})
  }

  return (
    <div className='modal-wrapper' style={{display: global.state.showFakeoutModal ? 'block' : 'none'}}>
      <div className='modal creator'>
        <h3>Fakeout Tokens</h3>
        <h4>Should the question have fakeout tokens?</h4>
        <span className="pref-select">
          <input type="radio" name="check-select" value={"yes"} onChange={handleFakeoutPref} checked={currentFakePref == "yes"}/>
          <span className={`radio-overlay ${currentFakePref == "yes" ? 'selected' : ''}`}></span>
          Yes
        </span>
        <span className="pref-select">
          <input type="radio" name="check-select" value={"no"} onChange={handleFakeoutPref} checked={currentFakePref == "no"}/>
          <span className={`radio-overlay left ${currentFakePref == "no" ? 'selected' : ''}`}></span>
          No
        </span>
        <FakeoutBuilder
          phrase={fakeout}
          legend={global.state.legend}
          format="fakeout"></FakeoutBuilder>
        <button onClick={dismiss}>Okay</button>
      </div>
      <div className='modal-bg'></div>
    </div>
  )
}

export default CreatorFakeoutModal
