import React from 'react'
import LineTag from '../components/LineTag'
import style from '../components/Style'
export const getStationName = (station) => {
  let {name,place} = station
  if(!name || ! place) return ""
  return `${name}, ${place}`
}


let deg2rad = function(deg) {
  return deg * (Math.PI/180)
}

export const getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}


export const getProductColorCode = (product) => {
  switch(product) {
    case 'SBAHN':
      return "#964438"
    case 'UBAHN':
      return "#dd3d4d"
    case 'BUS':
      return "#0d5c70"
    case 'TRAM':
      return "#ea4029"
    default: return "#222"
  }
}
// hardcoding this list is easier than obtaining it programmatically...
/*
  Its the U bahn and S bahn that are more colorful..
  for buses, trams and the rest they usually use a unified color.
*/
export const getColor = (line) => {
  switch(line) {
    case 'U1':
    case 'U7':
      return "#45803A"
    case 'U2':
      return "#C2133B"
    case 'U3':
    case 'U8':
      return "#F16E3B"
    case 'U4':
      return "#20B28D"
    case 'U5':
      return "#B77320"
    case 'U6':
      return "#0E6DB1"
    case "U": // some special trains...
      return
    case 'S1':
      return "#29C0E7"
    case 'S2':
      return "#73BE4C"
    case 'S3':
      return "#8E2C8D"
    case 'S4':
      return "#EB2131"
    // case 'S5': // theres no S5...
    case 'S6':
      return "#159865"
    case 'S7':
      return "#873330"
    case 'S8':
      return "#231F20"
    case 'S20':
      return "#E8536F"

  }
  // check if its a tram /metro bus
  if(line.match(/^\d{2}$/)) {
    let num = parseInt(line)
    if(12 <= num && num <= 37) return "#D62429" // the trams
    if(50 >= num) return "#EA6732" // the metro bus
  }

  if(line[0] == "R") {
    // the regional trains..
    return "#373B7D"
  }
  if(line[0] == "X") {
    // the express bus...
    return "#51907A"
  }

  // the bus, the unknown lines...
  return "#085365"
}
export const getProductShortName = (product) => {
  switch(product) {
    case 'TRAM':
      return 'Tram'
    case 'BUS':
      return product
    default:
      return product[0]
  }
}

export const getStationProductLineTags = (station) => {
  return station.products.map(p => <LineTag line={getProductShortName(p)} backgroundColor={getProductColorCode(p)} />)
}

export const flattenList = (lists) => {
  return lists.reduce((a,b) => ([...a,...b]),[])
}

export const unixTimeStampToDate = (ts) => new Date(ts)
export const pad = (s,len = 2) => s.toString().padStart(len,'0')
export const unixTimeStampToDateHHMM = (ts) => {
  let time = unixTimeStampToDate(ts)
  // let pad = (s) => s.toString().padStart(2,'0')
  let hh = pad(time.getHours())
  let mm = pad(time.getMinutes())
  return `${hh}:${mm}`
}
export const timeDifferenceToDateString = (timeA,timeB) => {
  let diff = timeB - timeA
  let hasPassed = diff < 0
  // https://stackoverflow.com/questions/1787939/check-time-difference-in-javascript#1788084
  var msec = diff;
  var hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  var mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  var ss = Math.floor(msec / 1000);
  msec -= ss * 1000;
  return {
    hh,mm,ss,hasPassed
  }
}
export const timeDifferenceFormatString = (timeA,timeB) => {
  let {hh,mm,ss,hasPassed} = timeDifferenceToDateString(timeA,timeB)
  let res = hasPassed?"-":"" // if time diff is negative, add a "-" in front
  if(hh == 0 && mm <= 1) return `< ${res}1min`
  if(hh > 0) return (`${res}${hh}:${mm}h`)
  return `${res}${mm}min`
}
export const timeDifferenceToDateHHMMSS = (timeA,timeB) => {
  let {hh,mm,ss,hasPassed} = timeDifferenceToDateString(timeA,timeB)
  let res = hasPassed?"-":"" // if time diff is negative, add a "-" in front
  if(hh > 0) res += (pad(hh) + ":") // since its more than an hour, concat the hour component from front
  return `${res}${pad(mm)}:${pad(ss)}`
}
export const listOfN = (n) => [...Array(n + 1).keys()].slice(1)

export const convertMVVStationToMVGStation = (mvvStation,mvgStationList) => {
  let correspondingMVGStation
  try {

    correspondingMVGStation = mvgStationList.find(mvgS => mvgS.id == parseInt(mvvStation.ref.id) % 1e5)
  } catch(e) {
    return null // aw..
  }
  // replace the coordinate to the corresponding mvg station's coordinate...
  let latlngCoord = [
    correspondingMVGStation.latitude,
    correspondingMVGStation.longitude
  ]
  return {...mvvStation, coords: latlngCoord}
}

export const getStationsBetween = (fromId,toId,mvvStations) => {
  let mvvStationsIds = mvvStations.map(s => parseInt(s.ref.id) % 1e5 ),
      fromIdInList = mvvStationsIds.indexOf(fromId),
      toIdInList   = mvvStationsIds.indexOf(toId),
      hasInvalid = fromIdInList < 0 || toIdInList < 0
  if (hasInvalid) return null
  else return (fromIdInList < toIdInList)?
    mvvStations.slice(fromIdInList,toIdInList) :
    mvvStations.slice(toIdInList,fromIdInList)
}

export const getConnectionPartCacheLabel = (part) => {
  let fromStationId = part.from.id,
      toStationId   = part.to.id,
      cacheLabel = `${fromStationId}-${toStationId}-${part.label}`
  return cacheLabel
}

export const getStationLatLng = (station) => {
  return [station.latitude,station.longitude]
}
export const getStationOverviewComponent = (station) => {
  return (
    <div style={style.stationSelection}>

      <div style={style.stationSelection.labels}>
        {getStationProductLineTags(station)}
      </div>
      <div style={style.stationSelection.name}>
        {station.name}
      </div>

     </div>
  )
}
