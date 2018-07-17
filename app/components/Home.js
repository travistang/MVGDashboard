// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavItem,
  NavDropdown,
  MenuItem,
  Nav
} from 'react-bootstrap'
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;
  constructor(props) {
    super(props)
    this.state = {
      time: new Date()
    }
    // update the time every one second
    setInterval(() => {
      this.setState({time: new Date()})
    },1000)
  }
  navBar() {
    return (
      <Navbar fluid staticTop>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#home">MVG Dashboard</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">
            {this.state.time.toLocaleString()}
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
