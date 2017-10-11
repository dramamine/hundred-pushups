import React from 'react'
import globe from '../stores/globe'

const dispatchClick = () => {
  globe.dispatch((state) => {
    console.log('dispatched fn was called.')
    state.pushupCounter += 1
  })
}

const PushupButton = () => (
  <button onClick={ dispatchClick } >Do a Pushup</button>
)

export default PushupButton