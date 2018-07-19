import React from 'react'
import style from './Style.js'
import {Glyphicon} from 'react-bootstrap'
import PropTypes from 'prop-types'
export default class ImageWithText extends React.Component {
  getIcon() {
    if(!this.props.glyphicon) return null
    return <Glyphicon glyph={this.props.glyphicon} />
  }
  render() {
    // let iwtStyle =
    return (
      <div style={{...style.imageWithText,opacity:this.props.opacity || 1}}>
        {this.getIcon()}
        <h4>{this.props.text}</h4>
      </div>
    )
  }
}

ImageWithText.propTypes = {
  glyphicon: PropTypes.string,
  text: PropTypes.string.isRequired,
  opacity:PropTypes.number,
}
