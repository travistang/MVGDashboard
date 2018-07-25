import React from 'react'
import PropTypes from 'prop-types'
import style from './Style.js'
import LineTag from './LineTag'
import Autosuggest from 'react-autosuggest';
import * as Utils from '../utils/utils'
import {
  Well,
  Button,
  Form,
  FormGroup,
  InputGroup,
  Glyphicon,
  ControlLabel
} from 'react-bootstrap'
export default class DestinationCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      suggestions: [],
    }

  }
  getConnections() {
    // first check if we have "fastest connection" at all..
    let id = this.props.station.id
    if(!this.props.connections[id]) return null
    // get the list of our connections, then get the fastest one
    let connections = this.props.connections[id]
      .filter(conn => conn.departure > this.props.currentTime) // at least the train should still be here...
      .sort((conA,conB) => conA.arrival - conB.arrival)
      return connections

  }
  // this is a "placeholder" for the connections when the requested one is not available
  getConnectionLoadingComponent() {
    return (<h6> Fetching connections... </h6>)
  }
  // get the n-th connection component, sorted by time of ARRIVAL
  getConnectionDisplayComponents(n){
    let connections = this.getConnections()
    if(!connections || n >= connections.length) return this.getConnectionLoadingComponent()

    let connection = connections[n]

    let intermediateComponent = <Glyphicon glyph="arrow-right" />
    let walkingComponent = <Glyphicon glyph="piggy-bank" /> // i found no pedestrian icon, just a pig there:)
    // get the "connection parts" of this connection, convert them to components
    let partComponents = connection.connectionPartList.map(part => {
      if(part.connectionPartType == "FOOTWAY") return walkingComponent // sorry you have to walk...
      else { // i think this is a transportation, now lets look at the part..
        let label = part.label
        // TODO: how to properly get the color of this transport!?
        let color = '#222'
        return <LineTag backgroundColor={color} line={label} />
      }
    })
    .map(part => <div style={style.destinationCard.transportationList}> {part} </div>)
    // make the "intermediateComponent" (i.e. arrow) and part components go one after another
    let res = partComponents.reduce((list,part) => list.concat(part,intermediateComponent),[])
    res.pop()
    return res
  }
  // if theres a connection for this dest,
  // return something like u1 -> s3 -> ...
  getFastestConnectionDisplayComponents() {
    return this.getConnectionDisplayComponents(0)
  }
  // you have the selection, now get back the station obj
  getStationObjFromName(val) {
    let station = this.props.stationsList.find(s => s.name.trim().toLowerCase() == val)
    if(station) {
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
      .filter(s => !this.props.destinations.some(dest => dest.id == s.id)) // dont add the stations again
      .sort((sa,sb) => sa.order - sb.order)
      .slice(0,15)
    this.setState({
      suggestions
    })
  }
  // onBlur = () => {
  //   this.props.onBlur && this.props.onBlur()
  // }
  getTravelTimeComponent() {
    let connections = this.getConnections()
    if(!connections || !connections.length ) return null
    let connection = connections[0] // will change to arbitrary connections later
    let fromTime = Utils.unixTimeStampToDateHHMM(connection.departure),
        toTime = Utils.unixTimeStampToDateHHMM(connection.arrival),
        remainTime = Utils.timeDifferenceToDateHHMMSS(this.props.currentTime,connection.departure),
        content = ` ${fromTime} - ${toTime}`
    return (
      <div style={style.destinationCard.upperRow.right}>
        <div style={style.destinationCard.upperRow.right.up}>
          <h4>{toTime}</h4>
        </div>
        <div style={style.destinationCard.upperRow.right.down}>
          <h6>Depart in {remainTime}</h6>
        </div>
      </div>

    )
  }
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
            <ControlLabel>
              Station Name:
            </ControlLabel>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
              getSuggestionValue={this.getSuggestionValue}
              renderSuggestion={this.renderSuggestion}
              inputProps={inputProps}
              theme={style.destinationCard.input}
            />
            <Button onClick={this.props.onCancel}>
              <Glyphicon glyph="remove" />
            </Button>
          </FormGroup>
        </Form>
      </Well>
    )
    // component that renders travel time of this connection
    return (
      
        <div style={style.destinationCard}>
          <div style={style.destinationCard.upperRow}>
            <div style={style.destinationCard.upperRow.left}>
              {!this.props.isRemoving && <h6>to</h6>} <h4 style={style.destinationCard.upperRow.left.name}> {this.props.station.name} </h4>
            </div>
            {this.props.isRemoving?this.getRemoveComponent():this.getTravelTimeComponent()}
          </div>
          { !this.props.isRemoving &&
            (<div style={style.destinationCard.lowerRow}>
              {this.getFastestConnectionDisplayComponents()}
            </div>)
          }
        </div>

    )
  }
  isEdit() {
    return !this.props.station
  }
  getRemoveComponent() {
    return (
      <div style={style.destinationCard.upperRow.remove}>
        <Button bsStyle="danger" onClick={this.props.onRemove}>
          <Glyphicon glyph="trash" />
        </Button>
      </div>
    )
  }
}

// DestinationCard.propTypes = {
//   station: PropTypes.object,
//   isEditing: PropTpes.boolean,
//
// }
