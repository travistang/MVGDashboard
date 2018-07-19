import React from 'react'
import style from './Style.js'
import ImageWithText from './ImageWithText'

export default class DestinationList extends React.Component {

  header() {
    return <h3> Time to Destination </h3>
  }
  addNewDestinationButton() {
    return <ImageWithText opacity={0.5} glyphicon="plus" text="Click to add a new destination" />
  }
  render() {
    return (
      <div style={style.mainContainer.leftContainer.bottomContainer}>
        {this.header()}
        {this.addNewDestinationButton()}
      </div>
    )
  }
}
