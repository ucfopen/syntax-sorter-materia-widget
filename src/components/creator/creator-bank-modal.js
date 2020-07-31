import React, {useContext} from 'react'
import { store } from '../../creator-store'

const CreatorBankModal = (props) => {

  const global = useContext(store)
  const dispatch = global.dispatch

  const currentNumAsk = global.state ? global.state.numAsk : 1
  const currentAskLimit = global.state ? global.state.askLimit : "no"
  const currentNumQs = global.state.items ? global.state.items.length : 1

  const handleAskLimitUpdate = (event) => {
    dispatch({type:'update_ask_limit', payload: event.target.value})
  }

  const handleNumAskUpdate = (event) => {
    dispatch({type:'update_num_ask', payload: event.target.value})
  }

  const dismiss = () => {
    dispatch({type: 'toggle_bank_modal'})
  }

  return (
    <div className='modal-wrapper' style={{display: global.state.showBankModal ? 'block' : 'none'}}>
      <div className='modal creator'>
        <h3>Question Bank</h3>
        <h4>Should the student have a set number of questions?</h4>
        <span className="pref-select">
          <input type="radio" name="check-select" value={"yes"} onChange={handleAskLimitUpdate} checked={currentAskLimit == "yes"}/>
          <span className={`radio-overlay ${currentAskLimit == "yes" ? 'selected' : ''}`}></span>
          Yes
        </span>
        <span className="pref-select">
          <input type="radio" name="check-select" value={"no"} onChange={handleAskLimitUpdate} checked={currentAskLimit == "no"}/>
          <span className={`radio-overlay left ${currentAskLimit == "no" ? 'selected' : ''}`}></span>
          No
        </span>
        <span className={`check-select ${currentAskLimit == "yes" ? "show" : ""}`}>
          Number of questions to ask
          <input className="num-ask" type="number" name="check-val" onChange={handleNumAskUpdate} value={currentNumAsk} placeholder={currentNumAsk} min="1" max={currentNumQs}/>
          out of {currentNumQs}
        </span>
        <button onClick={dismiss}>Okay</button>
      </div>
      <div className='modal-bg'></div>
    </div>
  )
}

export default CreatorBankModal
