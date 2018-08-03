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
  Popup as MapPopup
} from 'react-leaflet'
import style from './Style'
import StationSelection from '../containers/StationSelection'
import API from '../api'
export default class Popup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultLocation: null,
      stationChosen: null,
      mapCenter: props.closestStations && this.getStationLocation(props.closestStations[0]),
      displayMarker: [],
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
    this.setState({...this.state,stationChosen:station})
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
              position={this.getStationLocation(station)}
            />
          ))
        }
      </Map>
    )
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
                  <StationSelection onSelect={this.onStationChosen.bind(this)}/>
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
