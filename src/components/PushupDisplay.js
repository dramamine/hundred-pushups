import React from 'react'
import {withCommas} from '../utils/numdisplay'

const PushupDisplay = (props) => {
  return (
  <span>Pushups: {withCommas(props.pushups)}</span>
  )
}

export default PushupDisplay
