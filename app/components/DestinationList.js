import React from 'react'
import style from './Style.js'
import ImageWithText from './ImageWithText'

export default class DestinationList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAddingNewDestination: false,
    }
    // get destinations and they will be stored in the store

  }

  header() {
    if(this.props.destinations.length == 0) return null
    return <h3> Time to Destination </h3>
  }
  displayAddDestinationCell() {
    if(this.state.isAddingNewDestination) return
    this.setState({...this.state,isAddingNewDestination: true})

  }
  addNewDestinationButton() {
    return <ImageWithText onClick={this.displayAddDestinationCell.bind(this)} opacity={0.5} glyphicon="plus" text="Click to add a new destination" />
  }
  editComponent() {
    return <div> Edit component </div>
  }
  render() {
    return (
      <div style={style.mainContainer.leftContainer.bottomContainer}>
        {this.header()}
        {this.state.isAddingNewDestination && this.editComponent()}
        {this.addNewDestinationButton()}

      </div>
    )
  }
}
