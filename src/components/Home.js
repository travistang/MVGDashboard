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
  Modal,

  DropdownButton,
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
import _ from 'lodash'
import LineTag from './LineTag'
import {Map, TileLayer, Marker, Popup} from 'react-leaflet'
type Props = {};

export default class Home extends Component<Props> {
  props: Props;
  constructor(props) {
    super(props)

    // filter value, in minutes
    this.timeFilter = [1,3,5,10,15,20,30,40,60]
    this.state = {
      numDeparturesShown: 3,
      departurePage: 1,
      showPopup: false,

      filterLabel: null,
      timeFilter: null,
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
            <NavItem onClick={this.selectLocation.bind(this)} style={style.navBar.location}>
              {(this.props.closest_stations.length && this.props.closest_stations[0].name) || null}
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
    // clear the qr so that the popup will close
    this.props.clearDepartureQR()
  }
  // the component that renders the departure
  watchingDepatureComponent() {
    return (
      <div style={style.watchingDeparture}>
        <DepartureCard
          watching={true}
          departure={this.props.watchingDepature}>
        </DepartureCard>
      </div>
    )
  }
  leftContainer() {
    if(this.props.closest_stations.length == 0) return null
    let closestStation = this.props.closest_stations[0]

    if (!this.props.isChangingLocation)
    return (
      <div style={style.mainContainer.leftContainer}>
        {
          this.props.watchingDepature && this.watchingDepatureComponent()
        }
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
  getFilteredDepartureList() {
    return this.props.departures
    .filter(dept => !this.state.filterLabel || (dept.label && this.state.filterLabel === dept.label )) // filter according to the selected label to filter
    .filter(dept => !this.state.timeFilter || (dept.departureTime - this.props.currentTime) / (1000 * 60) > this.state.timeFilter)
  }
  departureList() {
    if(!this.getFilteredDepartureList().length) return (
      <ImageWithText glyphicon="exclamation-sign" text="No departures nearby or no matched departures found." opacity={0.8} />
    )
    let indexFrom = this.state.numDeparturesShown * (this.state.departurePage - 1)
    let indexTo = Math.min(this.props.departures.length,indexFrom + this.state.numDeparturesShown)
    return this.getFilteredDepartureList()
      .slice(indexFrom,indexTo)
      .map(departure => <DepartureCard departure={departure} />)
  }
  getDeparturePagination() {
    // you dont need a pager
    const fullDepartureList = this.getFilteredDepartureList()
    if(fullDepartureList.length <= this.state.numDeparturesShown) return null
    let numPageNeeded = Math.floor(fullDepartureList.length / this.state.numDeparturesShown)
    return (
      <Pagination>
        {Utils.listOfN(numPageNeeded).map(n => <Pagination.Item active={this.state.departurePage == n} onClick={() => this.setState({...this.state,departurePage: n})}>{n}</Pagination.Item>)}
      </Pagination>
    )
  }
  filterLabel(lbl) {
    this.setState({
      filterLabel: lbl,
      departurePage: 1 // always goes to the first page when filter changes
    })
  }
  departureLineFilterDropdownList() {
    const lblFilterOptions = _.uniq(this.props.departures.map(d => d.label)).map((lbl,i) => (
      <MenuItem key={i} eventKey={lbl} onSelect={this.filterLabel.bind(this)}>
        <div style={style.stationSelection}>
          <div style={style.stationSelection.labels}>
            <LineTag backgroundColor={Utils.getColor(lbl)} line={lbl} />

          </div>
          <div style={style.stationSelection.name}>
            {lbl}
          </div>
        </div>

      </MenuItem>
    ))
    return [
      (
        <MenuItem key={-1} envetKey={null} onSelect={this.filterLabel.bind(this)}>
          <div style={style.stationSelection}>
            <div style={style.stationSelection.labels}>
              <Glyphicon glyph="remove"></Glyphicon>
            </div>
            <div style={style.stationSelection.name}>
              No filter
            </div>
          </div>
        </MenuItem>
      ),
      ...lblFilterOptions,
    ]
  }
  departureTimeFilterDropdownList() {
    const timeOptions = this.timeFilter.map((t,i) => (
      <MenuItem key={i} eventKey={t} onSelect={this.filterTime.bind(this)}>
        <div style={style.stationSelection}>
          <div style={style.stationSelection.labels}>
            >{t}
          </div>
          <div style={style.stationSelection.name}>
            minutes
          </div>
        </div>
      </MenuItem>
    ))
    return [
      (
        <MenuItem key={-1} envetKey={null} onSelect={this.filterTime.bind(this)}>
          <div style={style.stationSelection}>
            <div style={style.stationSelection.labels}>
              <Glyphicon glyph="remove"></Glyphicon>
            </div>
            <div style={style.stationSelection.name}>
              No filter
            </div>
          </div>
        </MenuItem>
      ),
      ...timeOptions
    ]
  }
  filterTime(t) {
    this.setState({
      timeFilter: t,
      departurePage: 1,
    })
  }
  rightContainer() {
    if(this.props.closest_stations.length == 0) return null
    return (
      <div style={style.mainContainer.rightContainer}>
        <div style={style.mainContainer.rightContainer.topContainer}>
            <h2 style={{paddingRight: 16}}>Departures</h2>
            {
              this.props.departures.length &&
              ([
                (
                  <DropdownButton title={this.state.filterLabel || "Label filter"} bsSize="small">
                    {this.departureLineFilterDropdownList()}
                  </DropdownButton>
                ),
                (
                  <DropdownButton
                    title={(this.state.timeFilter && `>${this.state.timeFilter} minute(s)`) || "Time Filter"}
                    bsSize="small"
                  >
                    {this.departureTimeFilterDropdownList()}
                  </DropdownButton>
                )
              ]) || null
            }

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
        {(this.state.showPopup || this.props.destinationDetail || this.props.departureQR) && this.popup()}
        <div style={style.mainContainer}>
          {this.leftContainer()}
          {this.rightContainer()}
          {this.getMap()}
        </div>
      </div>
    );
  }
}
