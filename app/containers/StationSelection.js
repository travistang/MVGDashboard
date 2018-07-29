import React from 'react'
import StationSelection from '../components/StationSelection'
import {connect} from 'react-redux'
import * as LocationAction from '../actions/location'

function mapStateToProps(state) {
  return {
    ...state.mvg,
    ...state.location
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleChangeLocation: () => dispatch({type: LocationAction.TOGGLE_LOCATION_MODE})
  }
}
