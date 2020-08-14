import React, {useContext} from 'react'
import { store } from '../../player-store'

const WarningModal = (props) => {

  const global = useContext(store)
  const dispatch = global.dispatch

  const toggle = () => {
    dispatch({type: 'toggle_warning'})
  }

  const convertSortedToString = (sorted, pref = 'word') => {
    let string = ''
    for (let i=0;i<sorted.length;i++) {
      if (pref == 'word') string += sorted[i].value + ','
      else {
        for (const term of global.state.legend) {
          if (parseInt(sorted[i].legend) == term.id) string += term.name + ','
        }
      }
    }

    if (string.length == 0)
      string = ','

    return string.substring(0,string.length-1)
  }

  const handleSubmit = () => {
    for (let item of global.state.items) {
      Materia.Score.submitQuestionForScoring(item.qsetId, convertSortedToString(item.sorted, item.displayPref))
    }

    Materia.Engine.end(true)
  }

  return(
    <div className='warning-wrapper' style={{display: global.state.showWarning ? 'block' : 'none'}}>

      <div className='warning'>
        <span className='dev-warning'>You still have unfinished questions.</span>
        <h3>Are you sure you want to submit?</h3>
        <div className='warning-submit-holder'>
          <button onClick={handleSubmit}>Yes</button>
          <button onClick={toggle}>No</button>
        </div>
      </div>
      <div className='warning-bg'>
      </div>
    </div>
  )

}

export default WarningModal
