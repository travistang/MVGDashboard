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
