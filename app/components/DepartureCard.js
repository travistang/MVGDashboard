import React from 'react'
import style from './Style.js'
import LineTag from './LineTag'
import PropTypes from 'prop-types'
import * as Utils from '../utils/utils'

export default class DepartureCard extends React.Component {

  departureTime() {
    return Utils
      .unixTimeStampToDateHHMM(this.props.departure.departureTime)

  }
  timeLeft() {
    let {hasPassed,hh,mm,ss} = Utils.timeDifferenceToDateString(this.props.currentTime,this.props.departure.departureTime)
    if (hasPassed) return `Gone`
    let timestr
    let pad = (s) => s.toString().padStart(2,'0')
    if(hh > 0) timestr = `${pad(hh)}:${pad(mm)}:${pad(ss)}`
    else timestr = `${pad(mm)}:${pad(ss)}`
    return [
      <h6 style={style.centerContentStyle}> In </h6>,
      <h5 style={style.centerContentStyle}>{timestr}</h5>
    ]
  }
  lineTag() {
    return (
      <LineTag
        backgroundColor={this.props.departure.lineBackgroundColor}
        line={this.props.departure.label}
      />
    )
  }
  render() {
    return (
      <div style={style.departureCard}>
        <div style={style.departureCard.leftColumn}>
          {this.timeLeft()}
        </div>

        <div style={style.departureCard.middleColumn}>
          <div style={style.departureCard.middleColumn.upperRow}>
            {this.lineTag()}
            <div>{this.props.departure.destination}</div>
          </div>
          <div style={style.departureCard.middleColumn.lowerRow}>
            from <b>{this.props.departure.from.name}</b>
          </div>
        </div>

        <div style={style.departureCard.rightColumn}>
          <div style={style.departureCard.rightColumn.upperRow}>
            {this.departureTime()}
          </div>
        </div>
      </div>
    )
  }
}

DepartureCard.propTypes = {
  departure: PropTypes.object.isRequired,
  currentTime: PropTypes.object.isRequired,
  closestStations: PropTypes.object.isRequired,
}
