import React from 'react'
import PropTypes from 'prop-types'
import style from './Style.js'
import * as Utils from '../utils/utils'

export default class StationCard extends React.Component {
  getDistance() {
    if(!this.props.station) return 0
    let {latitude,longitude} = this.props.station
    let {lat,lng} = this.props
    return Utils.getDistanceFromLatLonInKm(lat,lng,latitude,longitude).toPrecision(3)
  }
  getTransportTypeToken(type) {
    let backgroundColor = Utils.getProductColorCode(type)
    let shortName = Utils.getProductShortName(type)
    let tokenStyle = {
      height: "16px",
      width: "24px",
      backgroundColor,
      margin: "4px",
      ...style.centerContentStyle,
    }
    return (
      <div style={tokenStyle}>
        {shortName}
      </div>
    )
  }
  render() {
    return (
      <div style={style.stationCard}>
        <div style={style.stationCard.leftContainer}>
          <h4> {Utils.getStationName(this.props.station)} </h4>
          <div style={style.stationCard.leftContainer.tokenList}>
            {this.props.station.products.map(this.getTransportTypeToken)}
          </div>
        </div>
        <div style={style.stationCard.rightContainer}>
          <h6>{this.getDistance()}km</h6>
        </div>
      </div>
    )
  }
}

StationCard.propTypes = {
  station: PropTypes.object.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired
}
