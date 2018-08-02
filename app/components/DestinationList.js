import React from 'react'
import style from './Style.js'
import ImageWithText from './ImageWithText'
import DestinationCard from '../containers/DestinationCard'
import * as DestinationAction from '../actions/destination'
import * as Utils from '../utils/utils'
import {
  Button,
  ButtonGroup,
  Pagination,
  Glyphicon
} from 'react-bootstrap'
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
  Circle
} from 'react-leaflet'

export default class DestinationList extends React.Component {

  constructor(props) {
    super(props)
    // an enum for representing display mode of the destinations
    this.displayMode = {
      LIST: 1,
      MAP: 2,
    }
    this.state = {
      numDestinationShown: 2,
      currentPage: 1,
      isAddingNewDestination: false,
      isRemoving: false,

      displayMode: this.displayMode.LIST,
    }
    // get destinations and they will be stored in the store
    this.props.getDestinations()

  }
  // the "map" mode component
  // which displays the fastest route to the destination
  getMap() {
    if(!this.props.closest_stations) return
    let station = this.props.closest_stations[0]
    let lat = station.latitude,
        lng = station.longitude
    return (
      <Map
        zoomControl={false}
        center={[lat,lng]}
        zoom={11}
        style={{height: "100%",width: "100%"}}
      >
        <TileLayer
          url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        />
        <Marker
          position={[lat,lng]}
          draggable={false}
        >
          <Tooltip permanent>
            You are here
          </Tooltip>
        </Marker>
        <Circle radius={2000} center={[lat,lng]}>
        </Circle>
        {this.props.destinations.map(dest => (
          <Marker
            draggable={false}
            position={[dest.latitude,dest.longitude]}
          >
            <Popup permanent>
                {dest.name}
            </Popup>
          </Marker>
        ))}

        {
          // convert the computed coords into line segments
          Object.values(this.props.connectionLines)
            .map(part => (
              <Polyline
                color={Utils.getColor(part.label)}
                positions={part.coords}
              >
                <Popup>
                  {part.label}
                </Popup>
              </Polyline>
            ))

        }
      </Map>
    )
  }
  // functions that gives the popup component for a marker on a destination
  getMarkerPopup(dest) {
    // return (
    //
    // )
  }
  header() {
    // if(this.props.destinations.length == 0 && !this.state.isAddingNewDestination) return null
    let buttons = Object.values(this.displayMode).map(mode => {
      const glpyhButton = (mode,glyph) => (
        <Button onClick={this.setDisplayMode.bind(this,mode)} bsSize="small">
          <Glyphicon glyph={glyph} />
        </Button>
      )
      switch(mode) {
        case this.displayMode.LIST:
          return glpyhButton(mode,"list")
        case this.displayMode.MAP:
          return glpyhButton(mode,"map-marker")
        default:
          return null
      }
    }) // initial list of group
    if(!this.state.isRemoving) {
      buttons = buttons.concat((
        <Button bsSize="small" bsStyle="danger" onClick={this.removeDestinations.bind(this)}>
          Remove
        </Button>
      ))
    } else {
      buttons = buttons.concat(
          [<Button bsSize="small" bsStyle="danger" onClick={this.clearDestinations.bind(this)}>
           Remove All
          </Button>,
          <Button bsSize="small" onClick={this.cancelRemoveDestinations.bind(this)}>
           Cancel
          </Button>]
        )

    }
    return (
      <div style={style.destinationList.header}>
        <h2> Time to Destination </h2>
        <ButtonGroup>
          {buttons}
        </ButtonGroup>
      </div>
    )
  }
  removeDestinations() {
    this.setState({
      ...this.state,
      isRemoving: true,
      currentPage:1, // need to go to the first page otherwise nothing is shown...
      displayMode: this.displayMode.LIST, // have to switch it back to list for delection - make it simple:)
      numDestinationShown: 5, // can show more as its slimmer
      isAddingNewDestination: false})
  }
  cancelRemoveDestinations() {
    this.setState({
      ...this.state,
      numDestinationShown: 3, // cannot show more as its bigger..
      isRemoving: false})
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
          .map(dest => <DestinationCard onRemove={() => this.props.removeDestination(dest.id)} isRemoving={this.state.isRemoving} station={dest} />)
          // lol!
          .concat(this.state.isAddingNewDestination?this.editComponent():null)
          .concat(this.state.isRemoving?null:this.addNewDestinationButton())
          .filter(component => !!component) // not null
          .slice(indexFrom,indexTo)
        }
      </div>
    )
  }
  paginationComponent() {
    let numComponents = this.props.destinations.length
    if(!this.state.isRemoving) numComponents++ // with add new component
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

  setDisplayMode(mode) {
    // check whether mode is value
    if(Object.values(this.displayMode).indexOf(mode) == -1) return
    this.setState({...this.state,displayMode: mode,isRemoving: this.state.isRemoving && mode != this.displayMode.MAP})
  }

  getDisplayComponents() {
    switch(this.state.displayMode) {
      case this.displayMode.LIST:
        return [
          this.destinationComponents(),
          this.props.destinations.length && this.paginationComponent()
        ]
      case this.displayMode.MAP:
        return this.getMap()

      default:
        return null
    }
  }

  render() {
    return (
      <div style={style.mainContainer.leftContainer.bottomContainer}>
        {this.header()}
        {this.getDisplayComponents()}
      </div>
    )
  }
}
