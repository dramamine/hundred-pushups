import React, {Component} from 'react'
import globe from '../stores/globe'
import PushupDisplay from './PushupDisplay'
import PushupButton from './PushupButton'

console.log('my globe:', globe)

export default class Main extends Component {
  constructor() {
    super()
    this.state = {
      ticks: 0
    }
    setInterval(this.tick.bind(this))
  }

  tick() {
    this.setState({
      ticks: this.state.ticks + 1
    })
  }

  render() {
    return (
      <div>
        <PushupDisplay pushups={ globe.state.pushupCounter } />
        <PushupButton />
        <div>
          <span>DEBUG: ticks = {this.state.ticks}</span>
        </div>
      </div>
      )
  }
}
