import React from 'react'
import {
  Modal,
  Button,
  Form,
  FormGroup,
  InputGroup,
  ControlLabel,
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
    return [
      station.latitude,
      station.longitude,
    ]
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
        style={{height:"70vh"}}
      >
        <TileLayer
          url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        />
        {
          this.state.displayMarker.map(station => (
            <Marker
              onClick={() => this.onStationChosen(station)}

              position={this.getStationLocation(station)}
            >
              <Tooltip permanent>
                <div >
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
  render() {
    return (
      <Modal show={true} bsSize="large" onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title> Choose your location </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={style.modal.container}>
            <div style={style.modal.inputField}>
              <Form inline>
                <FormGroup>

                  <ControlLabel> Choose the station that is closest to you:</ControlLabel>
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
