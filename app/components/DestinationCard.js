import React from 'react'
import PropTypes from 'prop-types'
import style from './Style.js'
import LineTag from './LineTag'
import Autosuggest from 'react-autosuggest';
import {
  Well,
  Button,
  Form,
  FormGroup,
  InputGroup
} from 'react-bootstrap'
export default class DestinationCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      suggestions: [],
    }

  }
  // you have the selection, now get back the station obj
  getStationObjFromName(val) {
    let station = this.props.stationsList.find(s => s.name.trim().toLowerCase() == val)
    if(station) {
      console.log(station)
      return station
    }
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

  renderSuggestion = (station) => {
    return <div> {station.name} </div>
  }

  getSuggestionValue = (station) => {
    return station.name
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  }

  onSuggestionsFetchRequested = ({value}) => {
    let searchString = value.trim().toLowerCase()
    if(searchString.length == 0) return []
    let suggestions = this.props.stationsList
      .map(s => ({...s,name: s.name.trim().toLowerCase()}))
      .map(s => ({...s,order: s.name.indexOf(searchString)}))
      .filter(s => s.order != -1)
      .sort((sa,sb) => sa.order - sb.order)
      .slice(0,15)
    this.setState({
      suggestions
    })
  }
  // onBlur = () => {
  //   this.props.onBlur && this.props.onBlur()
  // }

  render() {
    const { value, suggestions } = this.state
    const inputProps = {
      placeholder: "Give a station name",
      value,
      onChange: this.onChange,
      onBlur: this.onBlur
    }
    if(this.isEdit())
    return (
      <Well bsSize="large">
        <Form inline>
          <FormGroup>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
              getSuggestionValue={this.getSuggestionValue}
              renderSuggestion={this.renderSuggestion}
              inputProps={inputProps}
              theme={style.destinationCard.input}
            />
          </FormGroup>
        </Form>
      </Well>
    )
    return (
      <Well>
        <div style={style.destinationCard}>
          <div style={style.destinationCard.upperRow}>
            to <h4 style={style.destinationCard.upperRow.name}> {this.props.station.name} </h4>
          </div>
          <div style={style.destinationCard.lowerRow}>
            connection list here
          </div>
        </div>
      </Well>
    )
  }
  isEdit() {
    return !this.props.station
  }
}

// DestinationCard.propTypes = {
//   station: PropTypes.object,
//   isEditing: PropTpes.boolean,
//
// }
