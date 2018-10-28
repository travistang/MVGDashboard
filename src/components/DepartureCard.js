import React from 'react'
import style from './Style.js'
import LineTag from './LineTag'
import PropTypes from 'prop-types'
import * as Utils from '../utils/utils'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import _ from 'lodash'
export default class DepartureCard extends React.Component {

  departureTime() {
    return Utils
      .unixTimeStampToDateHHMM(this.props.departure.departureTime)

  }
  isGone() {
    let {hasPassed} = Utils.timeDifferenceToDateString(this.props.currentTime,this.props.departure.departureTime)
    return hasPassed
  }
  timeLeft() {
    if (this.isGone()) return <h6 style={{...style.centerContentStyle,color: "red"}}> Gone </h6>
    let {hh,mm,ss} = Utils.timeDifferenceToDateString(this.props.currentTime,this.props.departure.departureTime)
    let timestr
    let pad = (s) => s.toString().padStart(2,'0')
    if(hh > 0) timestr = `${pad(hh)}:${pad(mm)}:${pad(ss)}`
    else timestr = `${pad(mm)}:${pad(ss)}`
    return [
      (
        <div style={style.centerContentStyle}>
          <Glyphicon glyph="time" />
        </div>

      ),
      <h5 style={style.centerContentStyle}>{timestr}</h5>
    ]
  }
  lineTag() {
    return (
      <LineTag
        backgroundColor={Utils.getColor(this.props.departure.label)}
        line={this.props.departure.label}
      />
    )
  }
  onClick() {
    if(!this.props.watching && !this.isGone()) this.props.watchDeparture(this.props.departure)
  }

  // now here are some sort of maths...
  /*
    This function takes the remaining time and distance between current station and station of departure,
    and return the PROBABILITY of reaching the station ON OR BEFORE the departure time

    - first we take the average speed of human walking : 3.1mph (first result from Google...:https://www.reference.com/health/average-human-walking-speed-8df1ec5d0858683e)
    - then we take some standard deviation (which is an assumption) and model the probability distribution of the SPEED of the user (myself...?) as normal distribution
    - now we evaluate the PROBABILITY of arrive successfully
        = p(arrive before departure)
        = integrate(slowest_speed_to_catch departure, inf)
        where slowest_speed_to_catch_departure = distance / (departure_time - current_time)


  */
  getSuccessfulCatchPercentage() {
    // TODO: this
    return 1.0
  }
  showQRCode() {
    // prepare the qr code for the serialised departure
    const qr = btoa(
      JSON.stringify(
        _.pick(this.props.departure,
          'id,departureTime,label,destination'.split(',')
        )
      )
    )
    this.props.showQR(qr)
  }
  getSEVStyle() {
    if(this.props.departure.sev) {
      return {
        color: '#962984'
      }
    } else return {}
  }
  getLiveDepartureColor() {
    if(this.props.departure.live) {
      return {
        color: 'green'
      }
    } else {
      return {}
    }
  }
  render() {
    return (
      <div
        onClick={this.onClick.bind(this)}
        style={{...style.departureCard,opacity: (this.isGone())?0.5:1}}>
        <div style={{...style.departureCard.leftColumn,...this.getLiveDepartureColor()}}>
          {this.timeLeft()}
        </div>

        <div style={style.departureCard.middleColumn}>
          <div style={style.departureCard.middleColumn.upperRow}>
            {this.lineTag()}
            <div style={this.getSEVStyle()}>{this.props.departure.destination}</div>
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
        {
          /* For the watching part*/
          this.props.watching && (
            <div style={style.departureCard.rightColumn}>
              <div style={style.departureCard.rightColumn.center}>
                <div onClick={this.showQRCode.bind(this)}>
                  <Glyphicon glyph="qrcode" />
                </div>
              </div>
              <div style={style.departureCard.rightColumn.center}>
                <div onClick={this.props.removeWatchingDeparture}>
                  <Glyphicon glyph="remove" />
                </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

export class DepartureListHeader extends React.Component {
  render() {
    return (
      <div style={{...style.departureCard,width: '100%'}}>
        <div style={{...style.departureCard.leftColumn,display: 'flex', alignItems: 'center',justifyContent: 'center'}}>
          Time Left
        </div>

        <div style={{...style.departureCard.middleColumn,display: 'flex', alignItems: 'center',justifyContent: 'center'}}>
          Departure
        </div>

        <div style={style.departureCard.rightColumn}>
          <div style={{...style.departureCard.rightColumn.upperRow,display: 'flex', alignItems: 'center',justifyContent: 'center'}}>
            Time
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
