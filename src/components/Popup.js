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
  Glyphicon,
} from 'react-bootstrap'
import {
  Map,
  Marker,
  DivOverlay,
  Tooltip,
  Polyline,
  Popup as MapPopup
} from 'react-leaflet'
import style from './Style'
import ConnectionLine from './ConnectionLine'
import StationSelection from '../containers/StationSelection'
import InformationOverlay from './InformationOverlay'
import API from '../api'
import * as Utils from '../utils/utils'
import QRCode from 'qrcode.react'

export default class Popup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultLocation: null,
      stationChosen: null,
      mapCenter: props.closestStations && this.getStationLocation(props.closestStations[0]),
      displayMarker: [],
      connectionIndex: 0,
      numDisplayConnection: 5,
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
        {Utils.getMapTileLayer()}
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
  setConnectionIndex(i) {
    this.setState({...this.state,connectionIndex: i})
  }
  onInputFieldChange(inputFieldState) {
    this.setState({
      value: inputFieldState.value,
      mapCenter: inputFieldState.suggestions.length && this.getStationLocation(inputFieldState.suggestions[0])
    })
  }
  // function that evaluates the distances between closest stations and the given station
  getStationDistanceToLocation(dest) {
    let currentStation = this.props.closestStations[0]
    if (!currentStation) return 0 // wtf?
    return Utils.getDistanceFromLatLonInKm(currentStation.latitude,currentStation.longitude,dest.latitude,dest.longitude).toFixed(2)

  }
  getConnectionAttributeComponent(conn,firstConn,isFirst) {
    let Cell = (props) => (
      <div className={props.className} style={{...props.style, display: 'flex',flexDirection: 'column',textAlign: 'center'}}>
        <div style={{flex: 1}}>
          <span className={`glyphicon glyphicon-${props.icon}`} aria-hidden="true"></span> {props.title}
        </div>
        <div style={{flex: 1}}>
          {props.val}
        </div>
        {
          props.subval &&
          <div style={{flex: 1}} className="text-danger">
            {props.subval}
          </div>
        }
      </div>
    ),
    departure = Utils.unixTimeStampToDateHHMM(conn.departure),
    duration = Utils.timeDifferenceFormatString(conn.departure,conn.arrival),
    arrivalTime = Utils.unixTimeStampToDateHHMM(conn.arrival),

    firstDeparture =  Utils.unixTimeStampToDateHHMM(firstConn.departure),
    departureTimeDiff = Utils.timeDifferenceFormatString(firstConn.departure,conn.departure,true),
    firstDuration = Utils.timeDifferenceFormatString(firstConn.departure,firstConn.arrival),
    firstArrivalTime =  Utils.unixTimeStampToDateHHMM(firstConn.departure),
    arrivalTimeDiff = Utils.timeDifferenceFormatString(firstConn.arrival,conn.arrival,true)
    return (
      <div style={{display: 'flex'}}>
        <Cell
          style={{flex: 1, borderRight: '1px solid white'}}
          title="Departure"
          val={departure}
          subval={!isFirst && `(${departureTimeDiff})`}
          icon="time"
        />
        <Cell
          style={{flex: 1,borderLeft: '1px solid white'}}
          title="Total time"
          val={duration}
          icon="transfer"
        />
        <Cell
          style={{flex: 1}}
          className="bg-info"
          title="Arrival"
          val={arrivalTime}
          subval={!isFirst && `(${arrivalTimeDiff})`}
          icon="flag"
        />
      </div>
    )

  }
  // main component for rendering the details to a destination
  destinationDetailComponent() {
    let dest = this.props.destinationDetail // as an alias
    let connections = this.props.connections[dest.id] // may or may not be null!

    let ConnectionOverviewComponent = (props) => (
      <div style={{...props.style,display: 'flex'}} onClick={props.onClick}>
        {/* First column*/}
        <div style={{flex: 1, display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
          {Utils.unixTimeStampToDateHHMM(props.connection.departure)}
        </div>
        {/* Second column */}
        <div style={{flex: 2, display: 'flex',alignItems: 'center',flexWrap: 'wrap'}}>
          {Utils.getConnectionDisplayComponents(props.connection)}
        </div>
      </div>
    )
    return (
      <Modal show={true} bsSize="lg" onHide={this.props.onHide}>
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
                    <div style={{flex: 1,display: 'block', flexWrap: 'wrap'}}>
                      <h2 style={{marginTop: 0}}>{dest.name} </h2>
                    </div>
                    {/* Auxillary info */}
                    <div style={{flex: 1,display: 'flex',flexWrap: 'wrap'}}>
                      <div>
                        <span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
                        {this.getStationDistanceToLocation(dest)}km |
                      </div>
                      {Utils.getStationProductLineTags(dest)}
                    </div>
                  </div>
                  <div style={{flex: 1}}> {/* Second Column */}
                  {/* Get the fastest connection in this part*/}
                    {this.getConnectionAttributeComponent(connections[this.state.connectionIndex],connections[0],this.state.connectionIndex == 0)}
                  </div>
                </div>
                {/* Second row is for list of possible connections and map*/}
                <div style={{flex: 1,display:'flex',minHeight: '50vh'}}>
                  <div style={{flex:2}} >
                    {/* List of connections*/}
                    {
                      connections.map((conn,i) => (
                        <ConnectionOverviewComponent
                          onClick={this.setConnectionIndex.bind(this,i)}
                          style={(i == this.state.connectionIndex)?{background: 'rgba(255,255,255,0.5)'}:{}}
                          connection={conn} />
                      ))
                    }
                  </div>
                  <div style={{flex: 3}}>
                      <ConnectionLine connection={connections[this.state.connectionIndex]} />
                  </div>
                </div>
              </div>
            </Modal.Body>
          ):
          ( // no connection here
            // TODO: prettify this
            <InformationOverlay title="Fail to fetch connection..." />
            // <Label> Failed to fetch connection...</Label>
          )
        }

      </Modal>
    )
  }
  departureQRComponent() {
    return (
      <Modal show={true} bsSize="large" onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title> QR Code for this departure </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QRCode size={Math.round(window.innerHeight * 0.8)} value={this.props.departureQR} />
        </Modal.Body>
      </Modal>
    )
  }
  render() {
    if(this.props.destinationDetail)
      return this.destinationDetailComponent()
    else if(this.props.departureQR)
      return this.departureQRComponent()
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
