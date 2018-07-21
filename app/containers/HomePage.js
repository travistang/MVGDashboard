// @flow
import React, { Component } from 'react';
import Home from '../components/Home';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClockAction from '../actions/clock'
type Props = {};

function mapStateToProps(state) {
  return {
    ...state.clock,
    ...state.mvg
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleUpdate: () => dispatch({type: ClockAction.TOGGLE_UPDATE})
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Home)
