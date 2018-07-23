import React from 'react'
import style from './Style.js'
import ImageWithText from './ImageWithText'
import DestinationCard from '../containers/DestinationCard'
import * as DestinationAction from '../actions/destination'
import {
  Button,
  Pagination,
} from 'react-bootstrap'
import * as Utils from '../utils/utils'

export default class DestinationList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      numDestinationShown: 2,
      currentPage: 1,
      isAddingNewDestination: false,
    }
    // get destinations and they will be stored in the store
    this.props.getDestinations()
  }

  header() {
    // if(this.props.destinations.length == 0 && !this.state.isAddingNewDestination) return null
    return (
      <div style={style.destinationList.header}>
        <h2> Time to Destination </h2>
        <a onClick={this.clearDestinations.bind(this)}>
          <div href="#" > Remove All </div>
        </a>
      </div>
    )
  }
  clearDestinations(e) {
    e.preventDefault()
    this.props.clearDestinations()
  }
  displayAddDestinationCell() {
    if(this.state.isAddingNewDestination) return
    this.setState({...this.state,isAddingNewDestination: true})

  }
  cancelAdd() {
    this.setState({...this.state,isAddingNewDestination: false})
  }
  editComponent() {
    return (
      <DestinationCard isEditing={true}
        onCancel={this.cancelAdd.bind(this)}
        onSelect={this.addDestination.bind(this)}
      />
    )
  }
  addDestination(station) {

    this.props.addDestination(station)
    this.setState({isAddingNewDestination: false})
  }
  addNewDestinationButton() {
    return <ImageWithText onClick={this.displayAddDestinationCell.bind(this)} opacity={0.5} glyphicon="plus" text="Click to add a new destination" />
  }

  destinationComponents() {
    let indexFrom = this.state.numDestinationShown * (this.state.currentPage - 1)
    let indexTo = indexFrom + this.state.numDestinationShown
    return (
      <div style={style.destinationList.destinationContainer}>
        {this.props.destinations
          .map(dest => <DestinationCard station={dest} />)
          // lol!
          .concat(this.state.isAddingNewDestination?this.editComponent():null)
          .concat(this.addNewDestinationButton())
          .filter(component => !!component) // not null
          .slice(indexFrom,indexTo)
        }
      </div>
    )
  }
  paginationComponent() {
    let numComponents = this.props.destinations.length + 1 // with add new component
    if(this.state.isAddingNewDestination) numComponents++
    let numPageNeeded = Math.ceil(numComponents / this.state.numDestinationShown)
    if(numPageNeeded <= 1) return null // why do you need pagination if theres just a page..?
    return (
      <div style={style.destinationList.pagination}>
        <Pagination>
          {Utils.listOfN(numPageNeeded).map(n =>
            <Pagination.Item onClick={() => this.setState({...this.state,currentPage: n})}> {n} </Pagination.Item>
          )}
        </Pagination>
      </div>

    )
  }
  render() {
    return (
      <div style={style.mainContainer.leftContainer.bottomContainer}>
        {this.header()}
        {this.destinationComponents()}

        {this.props.destinations.length && this.paginationComponent()}
      </div>
    )
  }
}
