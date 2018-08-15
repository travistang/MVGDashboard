import React from 'react'
import style from './Style.js'
import PropTypes from 'prop-types'

export default function LineTag(props) {
  return (
    <div style={{...style.lineTag,...props}}>
      {props.line}
    </div>
  )
}
// export default class LineTag extends React.Component {
//   render() {
//     return (
//       <div style={{...style.lineTag,...this.props}}>
//         {this.props.line}
//       </div>
//     )
//   }
// }
//
// LineTag.propTypes = {
//   backgroundColor: PropTypes.string.isRequired,
//   line: PropTypes.string.isRequired
// }
