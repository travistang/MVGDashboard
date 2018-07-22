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
} from 'react-bootstrap'
import style from './Style.js';

import ImageWithText from './ImageWithText'
import InformationOverlay from './InformationOverlay'
import StationCard from './StationCard'
import DepartureCard from '../containers/DepartureCard'
import DestinationList from '../containers/DestinationList'
import * as Utils from '../utils/utils'
type Props = {};

export default class Home extends Component<Props> {
  props: Props;
  constructor(props) {
    super(props)

    this.state = {
      numDeparturesShown: 10,
      departurePage: 1,
    }
  }
  getNextRefreshTime() {
    let remainder = this.props.clock % 60
    if(remainder == 0) return 0
    return 60 - remainder
  }
  getNextRefreshComponent() {
    let nextRefreshTime = this.getNextRefreshTime()
    if(!this.props.shouldUpdate)
      return (
        <NavItem disabled>
          Refresh Paused ({this.getNextRefreshTime()})
        </NavItem>
      )
    if(nextRefreshTime == 0)
      return (
        <NavItem disabled>
            <Label bsStyle="success">Refreshing...</Label>
        </NavItem>
      )
    else
      return (
        <NavItem disabled>
          Next refresh in : {this.getNextRefreshTime()} second(s)
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
        <Nav>
        {
          this.isStationLoaded() && this.getNextRefreshComponent()
        }
          <NavItem onClick={this.props.toggleUpdate}>
            {this.props.shouldUpdate?"Stop update":"Resume update"}
          </NavItem>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">
            {this.props.currentTime.toLocaleString()}
          </NavItem>
        </Nav>
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
        title: this.props.error
      }
    }
    return (
      <InformationOverlay {...props} />
    )
  }
  leftContainer() {
    if(this.props.closest_stations.length == 0) return null
    let closestStation = this.props.closest_stations[0]

    return (
    <div style={style.mainContainer.leftContainer}>
      <div style={style.mainContainer.leftContainer.topContainer}>
        <h6> You are around </h6>
        <h1> {Utils.getStationName(closestStation)}
        </h1>
        <div style={style.tokenList}> {Utils.getStationProductLineTags(closestStation)} </div>
      </div>

      <DestinationList />

    </div>)
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
      <ImageWithText glyphicon="plus" text="No departures nearby" opacity={0.8} />
    )
    let indexFrom = this.state.numDeparturesShown * this.state.departurePage
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
  render() {
    return (

      <div>
        {(!this.isStationLoaded() || this.props.error) && this.loadingOverlay()}
        {this.navBar()}
        <div style={style.mainContainer}>
          {this.leftContainer()}
          {this.rightContainer()}
        </div>
      </div>
    );
  }
}
