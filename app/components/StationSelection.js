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
    return(
      <div style={style.stationSelection}>

      <div style={style.stationSelection.labels}>
      {Utils.getStationProductLineTags(station)}
      </div>
      <div style={style.stationSelection.name}>
        {station.name}
      </div>

       </div>)
  }

  getSuggestionValue = (station) => {
    return station.name
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  }
  onChange = (event, {newValue,method}) => {
    if('click,enter'.split(',').indexOf(method) != -1) {
      let stationObj = this.getStationObjFromName(newValue)
      if(stationObj) this.props.onSelect(stationObj)
    }
    this.setState({
      value: newValue
    })
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
    let station = this.props.stations.find(s => s.name.trim().toLowerCase() == val)
    if(station) {
      return station
    }
  }
  render() {
    const { value, suggestions } = this.state
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
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        theme={style.destinationCard.input}
      />
    )
  }
}
