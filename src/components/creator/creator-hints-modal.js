import React, {useContext} from 'react'
import { store } from '../../creator-store'

const CreatorHintsModal = (props) => {

  const global = useContext(store)
  const dispatch = global.dispatch

  const currentCheckPref = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].checkPref : 'no'
  const currentNumChecks = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].numChecks : 1
  const currentHintPref = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].hintPref : 'no'
  const currentHint = global.state.items[global.state.currentIndex] ? global.state.items[global.state.currentIndex].hint : ''

  const dismiss = () => {
    dispatch({type: 'toggle_hint_modal'})
  }

  const handleCheckPref = (event) => {
    dispatch({type: 'update_check_pref', payload: {
      questionIndex: global.state.currentIndex,
      pref: event.target.value
    }})
  }

  const handleNumChecks = (event) => {
    dispatch({type: 'update_num_checks', payload: {
      questionIndex: global.state.currentIndex,
      pref: event.target.value
    }})
  }

  const handleHint = (event) => {
    dispatch({type: 'update_hint', payload: {
      questionIndex: global.state.currentIndex,
      pref: event.target.value
    }})
  }

  return (
    <div className='modal-wrapper' style={{display: global.state.showHintModal ? 'block' : 'none'}}>
      <div className='modal creator'>
        <h3>Guess Limits and Hints</h3>
        <h4>Should the player have the option to guess?</h4>
        <span className="pref-select">
          <input type="radio" name="check-select" value={"yes"} onChange={handleCheckPref} checked={currentCheckPref == "yes"}/>
          <span className={`radio-overlay ${currentCheckPref == "yes" ? 'selected' : ''}`}></span>
          Yes
        </span>
        <span className="pref-select">
          <input type="radio" name="check-select" value={"no"} onChange={handleCheckPref} checked={currentCheckPref == "no"}/>
          <span className={`radio-overlay left ${currentCheckPref == "no" ? 'selected' : ''}`}></span>
          No
        </span>
        <span className={`check-select ${currentCheckPref == "yes" ? "show" : ""}`}>
          Number of checks
          <input type="number" name="check-val" onChange={handleNumChecks} value={currentNumChecks} placeholder={currentNumChecks} min="1" max="5"/>
        </span>
        <span className={`check-select bottom ${currentCheckPref == "yes" ? "show" : ""}`}>
          Hint (optional)
          <input className="hint-text" type="text" name="hint-val" onChange={handleHint} value={currentHint}/>
        </span>
        <button onClick={dismiss}>Save</button>
      </div>
      <div className='modal-bg'></div>
    </div>
  )
}

export default CreatorHintsModal
