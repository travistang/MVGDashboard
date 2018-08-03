import React from 'react'
import {
  Modal,
  Button,
  Form,
  FormGroup,
  InputGroup,
  ControlLabel,
} from 'react-bootstrap'
import style from './Style'
import StationSelection from '../containers/StationSelection'
export default class Popup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultLocation: null,
      stationChosen: null,
    }
  }
  onStationChosen(station) {
    this.setState({...this.state,stationChosen:station})
  }
  setLocation() {
    if(!this.state.stationChosen) return
    let {latitude,longitude} = this.state.stationChosen
    console.log('location of station chosen')
    console.log(latitude, " ",longitude)
    this.props.setLocation(latitude,longitude)
  }
  render() {
    return (
      <Modal show={true} bsSize="large" onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title> Choose your location </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={style.modal.container}>
            <div>
              <Form inline>
                <FormGroup>

                  <ControlLabel> Choose the station that is closest to you:</ControlLabel>
                  <StationSelection onSelect={this.onStationChosen.bind(this)}/>
                </FormGroup>
              </Form>

            </div>
            <div>
            </div>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={this.setLocation.bind(this)}
            disabled={this.state.stationChosen == null}
            bsStyle="success"> Change Location </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
