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
    console.log('connectionINde',this.state.connectionIndex)
    let dest = this.props.destinationDetail // as an alias
    let connections = this.props.connections[dest.id] // may or may not be null!
    let activeConnection = connections && connections[this.state.connectionIndex]
    let connectionLines = activeConnection && (() => {
      let fromStationId = activeConnection.from.id,
          toStationId   = activeConnection.to.id,
        // principle is, if the destination is unique,
        // there should be exactly one result when looking for keys in connectionLInes
        labels = Object.keys(this.props.connectionLines).map(Utils.splitConnectionPartCacheLabel),
        relevantLabels = [],
        curLabel = labels.find(l => l.to == toStationId)
      if(!curLabel) return []
      console.log('from',fromStationId,'toSTationId',toStationId,'labels',labels)
      do {
          relevantLabels.push(curLabel.label)
          // move one up...
          curLabel = labels.find(l => l.to == curLabel.from) // traceback once...
      }while(curLabel && curLabel.to !== fromStationId)
        return relevantLabels
    })() //
    // all other utils goes here, don't disturb whats outside...
    // all of them should be FUNCTIONS! Why? because if connections is null and the reference is used directly,
    // then it definitely throws something here...
    console.log('connection lines computed',connectionLines)
    let ConnectionOverviewComponent = (props) => (
      <div style={{...props.style,display: 'flex'}} onClick={props.onClick}>
        {/* First column*/}
        <div style={{flex: 1, display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
          {Utils.unixTimeStampToDateHHMM(props.connection.departure)}
        </div>
        {/* Second column */}
        <div style={{flex: 2, display: 'flex',alignItems: 'center'}}>
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
                    <div style={{flex: 1,display: 'block'}}>
                      <h2 style={{marginTop: 0}}>{dest.name} </h2>
                      <Label size="small" bsStyle="info"> {this.getStationDistanceToLocation(dest)} km away </Label>
                    </div>
                    <div style={{flex: 1,display: 'flex',flexWrap: 'wrap'}}>
                      {Utils.getStationProductLineTags(dest)}
                    </div>
                  </div>
                  <div style={{flex: 1}}>
                  {/* Get the fastest connection in this part*/}
                    {this.getConnectionAttributeComponent(connections[this.state.connectionIndex],connections[0],this.state.connectionIndex == 0)}
                  </div>
                </div>
                {/* Second row is for list of possible connections and map*/}
                <div style={{flex: 1,display:'flex'}}>
                  <div style={{flex:1}} >
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
                  <div style={{flex: 2}}>
                    {/* Map */}
                    <Map
                      zoom={11}
                      center={Utils.getStationLatLng(activeConnection.to)}
                      style={{height: '100%',width: '100%'}}
                      zoomControl={false}
                    >
                      {Utils.getMapTileLayer()}
                      {/* From and to marker*/}
                      {
                        [activeConnection.from,activeConnection.to].map(station => (
                          <Marker key={station.id} position={Utils.getStationLatLng(station)}>
                            <Tooltip permanent>
                              {station.name}
                            </Tooltip>
                            {
                              connectionLines.map(line => (
                                <Polyline
                                  color={Utils.getColor(this.props.connectionLines[line].label)}
                                  positions={this.props.connectionLines[line].coords}
                                />
                              ))
                            }
                          </Marker>
                        ))
                      }
                    </Map>
                  </div>
                </div>
              </div>
            </Modal.Body>
          ):
          ( // no connection here
            // TODO: prettify this
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
