// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavItem,
  NavDropdown,
  MenuItem,
  Nav,
  Label
} from 'react-bootstrap'
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;
  constructor(props) {
    super(props)
  }
  getNextRefreshTime() {
    let remainder = this.props.clock % 60
    if(remainder == 0) return 0
    return 60 - remainder
  }
  getNextRefreshComponent() {
    let nextRefreshTime = this.getNextRefreshTime()
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
        </NavItem >
      )
  }
  navBar() {
    return (
      <Navbar fluid staticTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#home">MVG Dashboard</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
        {
          this.getNextRefreshComponent()
        }
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">
            {this.props.currentTime.toLocaleString()}
          </NavItem>
        </Nav>
      </Navbar>)
  }
  render() {
    return (
      <div>
        {this.navBar()}
      </div>
    );
  }
}
