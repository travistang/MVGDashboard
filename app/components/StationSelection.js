import React from 'react'
import Autosuggest from 'react-autosuggest'
import {
  Well,
  FormGroup,
  ControlLabel,
} from 'react-bootstrap'
import style from './Style.js';

export default class StationSelection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: '',
      suggestions: []
    }
  }
  render() {
    const inputProps = {
      placeholder: "Give a station name",
      value,
      onChange: this.onChange,
      onBlur: this.onBlur
    }

    return (
      <Well bsSize="large">
        <h3> Choose your location </h3>
        <h6> You can drag and select the location you want on the map.</h6>
        <h6> Or you can simply input the station below </h6>
        <Form>
          <FormGroup>
            <ControlLabel> Station you are at: </ControlLabel>
            <Autosuggest
              suggestions={this.state.suggestions}
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
  }
}
