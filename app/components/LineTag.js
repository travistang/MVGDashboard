import React from 'react'
import style from './Style.js'

export default class LineTag extends React.Component {
  render() {
    return (
      <div style={{...style.lineTag,...this.props}}>
        {this.props.line}
      </div>
    )
  }
}

LineTag.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  line: PropTypes.string.isRequired
}
