import React from 'react'
import Autosuggest from 'react-autosuggest'
import {
  Well,
  FormGroup,
  ControlLabel,
} from 'react-bootstrap'
import style from './Style.js';
import * as Utils from '../utils/utils'
export default class StationSelection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      suggestions: []
    }
  }
  renderSuggestion = (station) => {
    return Utils.getStationOverviewComponent(station)
  }

  getSuggestionValue = (station) => {
    return station.id
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  }
  onChange = (event, {newValue,method}) => {
    if('up,down'.split(',').indexOf(method) != -1) return // no change here..
    if('click,enter'.split(',').indexOf(method) != -1) {
      let stationObj = this.getStationObjFromName(newValue)
      if(stationObj) this.props.onSelect(stationObj)
    }
    else if(this.props.value == null) { // this is not given
      this.setState({
        value: newValue
      })
    } else if(this.props.onChange){
      this.props.onChange({
        value: newValue,
        suggestions: this.state.suggestions
      }) // this gives the input value only!
    }
  }
  onSuggestionsFetchRequested = ({value}) => {
    let searchString = value.trim().toLowerCase()
    if(searchString.length == 0) return []
    let suggestions = this.props.stations
      .map(s => ({...s,name: s.name.trim().toLowerCase()}))
      .map(s => ({...s,order: s.name.indexOf(searchString)}))
      .filter(s => s.order != -1)
      .sort((sa,sb) => sa.order - sb.order)
      .slice(0,15)
    this.setState({
      suggestions
    })
  }
  getStationObjFromName(val) {
    // let station = this.props.stations.find(s => s.name.trim().toLowerCase() == val)
    let station = this.props.stations.find(s => s.id == val)
    if(station) {
      return station
    }
  }
  onSuggestionHighlighted({suggestion}) {
    if(this.props.onChange && this.props.value && suggestion) this.props.onChange({
      value: this.props.value,
      suggestions: [suggestion]
    })
  }
  render() {
    let { value, suggestions } = this.state
    if(this.props.value) value = this.props.value // use an external one if it is given
    const inputProps = {
      placeholder: "Give a station name",
      value,
      onChange: this.onChange,
      onBlur: this.onBlur
    }

    return (
      <Autosuggest
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
        onSuggestionHighlighted={this.onSuggestionHighlighted.bind(this)}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        theme={style.destinationCard.input}
      />
    )
  }
}
