// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavItem,
  NavDropdown,
  MenuItem,
  Nav,
  Label,
  Pagination,
  Well,
  FormGroup,
  ControlLabel,
  Glyphicon,
  Modal
} from 'react-bootstrap'
import style from './Style.js';
import DetailsPopup from '../containers/Popup'
import ImageWithText from './ImageWithText'
import InformationOverlay from './InformationOverlay'
import StationCard from './StationCard'
import DepartureCard from '../containers/DepartureCard'
import StationSelection from './StationSelection'
import DestinationList from '../containers/DestinationList'
import {DepartureListHeader} from '../components/DepartureCard'
import * as Utils from '../utils/utils'
import {Map, TileLayer, Marker, Popup} from 'react-leaflet'
type Props = {};

export default class Home extends Component<Props> {
  props: Props;
  constructor(props) {
    super(props)

    this.state = {
      numDeparturesShown: 5,
      departurePage: 1,
      showPopup: false,
    }
  }
  getNextRefreshTime() {
    let remainder = this.props.clock % 60
    if(remainder == 0) return 0
    return 60 - remainder
  }
  getNextRefreshComponent() {
    let nextRefreshTime = this.getNextRefreshTime()
    let content

    if(!this.props.shouldUpdate)
      content = `Refresh Paused (${this.getNextRefreshTime()})`
    else if(nextRefreshTime == 0)
      content = (<Label bsStyle="success">Refreshing...</Label>)
    else
      content = `Next refresh in : ${this.getNextRefreshTime()} second(s)`

    return (
      <NavItem onClick={this.props.toggleUpdate}>
        {content}
      </NavItem>
    )
  }
  navBar() {
    return (
      <Navbar fluid staticTop>
        <Navbar.Header>
          <Navbar.Brand>
            MVG Dashboard
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
          {
            this.isStationLoaded() && this.getNextRefreshComponent()
          }
          {/*
            <NavItem onClick={this.props.toggleUpdate}>
              {this.props.shouldUpdate?"Stop update":"Resume update"}
            </NavItem>
          */}

          </Nav>
          <Nav pullRight>
            {
              this.props.error && (
                <NavItem disabled>
                  <Label bsStyle="success">Error: {this.props.error.toString()}</Label>
                </NavItem>
              )
            }
            <NavItem onClick={this.selectLocation.bind(this)}>
              <span className="glyphicon glyphicon-map-marker" />
            </NavItem>
            <NavItem eventKey={1} href="#">
              {this.props.currentTime.toLocaleString()}
            </NavItem>

          </Nav>


        </Navbar.Collapse>

      </Navbar>)
  }
  isStationLoaded() {
    return this.props.stations && this.props.stations.length > 0
  }
  loadingOverlay() {
    let props = {}
    if(!this.props.error) {
      props = {
        overlayType: "loading",
        title: "Loading Stations from MVG..."
      }
    } else {
      props = {
        overlayType: "error",
        title: this.props.error.toString()
      }
    }
    return (
      <InformationOverlay {...props} />
    )
  }
  getMap() {
    return null
    if(!this.props.closest_stations || !this.props.closest_stations.length) return
    let station = this.props.closest_stations[0]
    let lat = station.latitude,
        lng = station.longitude
    //
    return (
      <Map
        zoomControl={false}
        center={[lat,lng]}
        zoom={13}
        opacity={0.7}
        draggable={false}
        style={{position: "absolute",top: 0,left:0, right: 0, bottom: 0, opacity: 0.5}}
      >
        <TileLayer
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png"
        />
        {this.props.closest_stations.map(s => (
          <Marker
            key={s.name}
            opacity={0.7}
            draggable={false}
            position={[s.latitude,s.longitude]}
          >
            <Popup>
              {s.name}
            </Popup>
          </Marker>
        ))}
      </Map>
    )
  }

  selectLocation() {
    this.setState({...this.state,showPopup: true})
  }
  hidePopup() {
    this.setState({...this.state,showPopup: false})
    // clear the destination detail so that the popup will close
    this.props.clearDestinationDetail()
  }
  leftContainer() {
    if(this.props.closest_stations.length == 0) return null
    let closestStation = this.props.closest_stations[0]

    if (!this.props.isChangingLocation)
    return (
      <div style={style.mainContainer.leftContainer}>
        {/*
          <div style={style.mainContainer.leftContainer.topContainer}>
          <div
            onClick={this.selectLocation.bind(this)}
            style={style.mainContainer.leftContainer.topContainer.overlay}
          >
            <h6> You are around </h6>
            <h2>
              {Utils.getStationName(closestStation)}
            </h2>

          </div>

        </div>
        */}

        <DestinationList />

      </div>
    )

    // input field for changing location
    return (
      <StationSelection />
    )
  }

  closestStationList() {
    if(!this.props.closest_stations || !this.props.closest_stations.length) return (
      <div style={style.centerContentStyle}>
        <h5> No stations around </h5>
      </div>
    )
    let headerElement = <h3> Stations Nearby </h3>
    let stationElements = this.props.closest_stations
      .map(s => <StationCard station={s} lat={this.props.lat} lng={this.props.lng} />)
      .slice(1)
    return [
      headerElement,
      ...stationElements
    ]
  }
  departureList() {
    if(!this.props.departures.length) return (
      <ImageWithText glyphicon="exclamation-sign" text="No departures nearby" opacity={0.8} />
    )
    let indexFrom = this.state.numDeparturesShown * (this.state.departurePage - 1)
    let indexTo = Math.min(this.props.departures.length,indexFrom + this.state.numDeparturesShown)
    return this.props.departures
      .slice(indexFrom,indexTo)
      .map(departure => <DepartureCard departure={departure} />)
  }
  getDeparturePagination() {
    // you dont need a pager
    if(this.props.departures.length <= this.state.numDeparturesShown) return null
    let numPageNeeded = Math.floor(this.props.departures.length / this.state.numDeparturesShown)
    return (
      <Pagination>
        {Utils.listOfN(numPageNeeded).map(n => <Pagination.Item active={this.state.departurePage == n} onClick={() => this.setState({...this.state,departurePage: n})}>{n}</Pagination.Item>)}
      </Pagination>
    )
  }
  rightContainer() {
    if(this.props.closest_stations.length == 0) return null
    return (
      <div style={style.mainContainer.rightContainer}>
        <div style={style.mainContainer.rightContainer.topContainer}>
            <h2>Departures</h2>
        </div>

        <div style={style.mainContainer.rightContainer.middleContainer}>
          {this.departureList()}
        </div>

        <div style={style.mainContainer.rightContainer.bottomContainer}>
          {this.getDeparturePagination()}
        </div>
      </div>
    )
  }
  popup() {
    return (
      <DetailsPopup onHide={this.hidePopup.bind(this)} />
    )
  }
  render() {
    return (
      <div style={style.app}>
        {(!this.isStationLoaded()) && this.loadingOverlay()}
        {this.navBar()}
        {/* Some more usage of the popup: show destination details...*/}
        {(this.state.showPopup || this.props.destinationDetail) && this.popup()}
        <div style={style.mainContainer}>
          {this.leftContainer()}
          {this.rightContainer()}
          {this.getMap()}
        </div>
      </div>
    );
  }
}
