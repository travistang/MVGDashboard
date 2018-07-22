import React from 'react'
import style from './Style.js'
import ImageWithText from './ImageWithText'
import DestinationCard from '../containers/DestinationCard'
import * as DestinationAction from '../actions/destination'
import {
  Button
} from 'react-bootstrap'

export default class DestinationList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAddingNewDestination: false,
    }
    // get destinations and they will be stored in the store
    this.props.getDestinations()
  }

  header() {
    // if(this.props.destinations.length == 0 && !this.state.isAddingNewDestination) return null
    return (
      <div>
        <h2> Time to Destination </h2>
        <Button onClick={this.props.clearDestinations}> Remove All </Button>
      </div>
    )
  }
  displayAddDestinationCell() {
    if(this.state.isAddingNewDestination) return
    this.setState({...this.state,isAddingNewDestination: true})

  }
  addNewDestinationButton() {
    return <ImageWithText onClick={this.displayAddDestinationCell.bind(this)} opacity={0.5} glyphicon="plus" text="Click to add a new destination" />
  }
  editComponent() {
    return <DestinationCard isEditing={true} onSelect={this.addDestination.bind(this)} />
  }
  addDestination(station) {

    this.props.addDestination(station)
    this.setState({isAddingNewDestination: false})
  }

  destinationComponents() {
    console.log('destination list')
    console.log(this.props.destinations)
    return (this.props.destinations.map(dest => <div> {dest.name} </div>))
  }

  render() {
    return (
      <div style={style.mainContainer.leftContainer.bottomContainer}>
        {this.header()}
        {this.destinationComponents()}
        {this.state.isAddingNewDestination && this.editComponent()}
        {this.addNewDestinationButton()}

      </div>
    )
  }
}
