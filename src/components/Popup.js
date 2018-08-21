import React from 'react'
import {
  Modal,
  Button,
  Form,
  FormGroup,
  InputGroup,
  ControlLabel,
  Container,
  Row,Col,
  Label,
} from 'react-bootstrap'
import {
  Map,
  TileLayer,
  Marker,
  DivOverlay,
  Tooltip,
  Popup as MapPopup
} from 'react-leaflet'
import style from './Style'
import StationSelection from '../containers/StationSelection'
import API from '../api'
import * as Utils from '../utils/utils'
export default class Popup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultLocation: null,
      stationChosen: null,
      mapCenter: props.closestStations && this.getStationLocation(props.closestStations[0]),
      displayMarker: [],
      value: '' // not the station chosen, for input field only
    }
    this.apiInstance = new API()
  }
  getStationLocation(station) {
    return Utils.getStationLatLng(station)
  }
  onStationChosen(station) {
    this.setState({...this.state,
      stationChosen:station,
      value: Utils.getStationName(station),
      mapCenter: this.getStationLocation(station)})
  }
  setLocation() {
    if(!this.state.stationChosen) return
    let {latitude,longitude} = this.state.stationChosen
    this.props.setLocation(latitude,longitude)
  }
  async onMapMoveEnd({center},zoom) {
    let closestStationsToMapCenter = await this.apiInstance.getClosestStations(center[0],center[1],this.props.stations,15)
    this.setState({...this.state,displayMarker:closestStationsToMapCenter})
  }
  getMap() {
    return (
      <Map
        zoomControl={false}
        onViewportChanged={this.onMapMoveEnd.bind(this)}
        center={this.state.mapCenter}
        zoom={11}
        style={{height:"60vh"}}
      >
        <TileLayer
          url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        />
        {
          this.state.displayMarker.map(station => (
            <Marker key={station.id}
              onClick={() => this.onStationChosen(station)}

              position={this.getStationLocation(station)}
            >
              <Tooltip permanent>
                <div>
                  {Utils.getStationOverviewComponent(station)}
                </div>

              </Tooltip>
            </Marker>)
          )
        }
      </Map>
    )
  }
  onInputFieldChange(inputFieldState) {
    this.setState({
      value: inputFieldState.value,
      mapCenter: inputFieldState.suggestions.length && this.getStationLocation(inputFieldState.suggestions[0])
    })
  }
  // function that evaluates the distances between closest stations and the given station
  getStationDistanceToLocation(dest) { return 10. } // just a placeholder
  // main component for rendering the details to a destination
  destinationDetailComponent() {
    let dest = this.props.destinationDetail // as an alias
    let connections = this.props.connections[dest.id] // may or may not be null!
    // all other utils goes here, don't disturb whats outside...
    // all of them should be FUNCTIONS! Why? because if connections is null and the reference is used directly,
    // then it definitely throws something here...
    return (
      <Modal show={true} bsSize="large" onHide={this.props.onHide}>
        <Modal.Header closeButton>
          Connections to {dest.name}
        </Modal.Header>
        {
          connections?(
            <Modal.Body>
              <div style={{display: 'flex',flexDirection: 'column'}}>
                {/* First row is for station details, and time for earliest arrival*/}
                <div style={{flex: 1,display:'flex'}}>
                  {/* Basic info of the station, like name, latlng, product names...*/}
                  <div style={{flex: 1}}> {/* First Column*/}
                    {/* Name of station*/}
                    <div>
                      <h3>{dest.name}</h3> <Label bsStyle="info"> {this.getStationDistanceToLocation(dest)} km away </Label>
                    </div>
                    <div style={{flex: 1,display: 'flex',flexWrap: 'wrap'}}>
                      {Utils.getStationProductLineTags(dest)}
                    </div>
                  </div>
                  <div style={{flex: 1}}>
                  </div>
                </div>
                {/* Second row is for list of possible connections and map*/}
                <div>
                  <div>
                    {/* List of connections*/}
                  </div>
                  <div>
                    {/* Map */}
                  </div>
                </div>
              </div>
            </Modal.Body>
          ):
          ( // no connection here
            <Label> Failed to fetch connection...</Label>
          )
        }

      </Modal>
    )
  }
  render() {
    if(this.props.destinationDetail)
      return this.destinationDetailComponent()
    else
    return (
      <Modal show={true} bsSize="large" onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title> Choose your location </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={style.modal.container}>
            <div style={style.modal.inputField}>
              <Form>
                <FormGroup>

                  <ControlLabel> Choose the station that is the closest to you:</ControlLabel>
                  <StationSelection
                    value={this.state.value}
                    onChange={this.onInputFieldChange.bind(this)}
                    onSelect={this.onStationChosen.bind(this)}/>
                </FormGroup>
              </Form>

            </div>
            <div style={style.modal.map}>
              {this.getMap()}
            </div>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.setLocation.bind(this)}
            disabled={this.state.stationChosen == null}
            bsStyle="success"> Change Location </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
