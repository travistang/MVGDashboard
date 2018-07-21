import React from 'react'
// import style from './Style.js'
import LineTag from './LineTag'
import PropTypes from 'prop-types'
import * as Utils from '../utils/utils'
let style = {
  departureCard: {
    display: 'flex',
    flexDirection: 'row',
    height: "72px",
    leftColumn: {
      flex: 1,
    },
    middleColumn: {
      flex: 4,

      display: 'flex',
      flexDirection: 'column',
      upperRow: {
        flex: 1,
        fontWeight: "bold",
      },
      lowerRow: {
        flex: 1,
        fontSize: '9px',
      }
    },

    rightColumn: {
      flex: 1,
      display: 'flex',
      flexDirection: "column",
      alignItems: "flex-start",
      upperRow: {
        flex: 1,
      }
    }

  }
}
export default class DepartureCard extends React.Component {

  departureTime() {
    return Utils
      .unixTimeStampToDate(this.props.departure.departureTime)
      .toLocaleTimeString()
      .substring(0,5)
  }
  timeLeft() {
    let {hasPassed,hh,mm,ss} = Utils.timeDifferenceToDateString(this.props.currentTime,this.props.departure.departureTime)
    if (hasPassed) return `Gone`
    if(hh > 0) return `${hh}:${mm}:${ss}`
    else return `${mm}:${ss}`
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
            {this.lineTag()} {this.props.departure.destination}
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
