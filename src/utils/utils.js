import React from 'react'
import LineTag from '../components/LineTag'
import style from '../components/Style'
import {
  Glyphicon
} from 'react-bootstrap'
import {
  TileLayer
} from 'react-leaflet'
export const getMapTileLayer = () => {
  return (
    <TileLayer
      url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    />
  )
}
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

  if(!line) return '#eeeeee' // a gray line
  if(line.indexOf('-') > 0) {
    // SEV cases..
    line = line.split('-')[0]
  }
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
export const getConnectionDisplayComponents = (connection) => {
  let intermediateComponent = <Glyphicon glyph="arrow-right" />
  let walkingComponent = <Glyphicon glyph="piggy-bank" /> // i found no pedestrian icon, just a pig there:)
  // get the "connection parts" of this connection, convert them to components
  let partComponents = connection.connectionPartList.map(part => {
    if(part.connectionPartType == "FOOTWAY") return walkingComponent // sorry you have to walk...
    else { // i think this is a transportation, now lets look at the part..
      let label = part.label
      return <LineTag key={part.label} backgroundColor={getColor(label)} line={label} />
    }
  })
  .map((part,i) => <div key={i} style={style.destinationCard.transportationList}> {part} </div>)
  // make the "intermediateComponent" (i.e. arrow) and part components go one after another
  let res = partComponents.reduce((list,part) => list.concat(part,intermediateComponent),[])
  res.pop() // why? because for the above lines one part label and one arrow is added for each part.
  // But I dont want the last arrow to be there, thats why I pop..
  return res
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
export const timeDifferenceFormatString = (timeA,timeB,withSign = false) => {
  let {hh,mm,ss,hasPassed} = timeDifferenceToDateString(timeA,timeB)
  let res = hasPassed?"-":(withSign?"+":"") // if time diff is negative, add a "-" in front
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


export const splitConnectionPartCacheLabel = (lbl) => {
  let parts = lbl.split('-')
  return {
    from: parseInt(parts[0]),
    to: parseInt(parts[1]),
    line: parts[2],
    label:lbl,
  }
}
export const getConnectionPartCacheLabel = (part) => {

  if(!part) return null // cannot compute...
  let fromStationId = part.from.id,
      toStationId   = part.to.id
  if(part.connectionPartType == "FOOTWAY")
    return `${fromStationId}-${toStationId}-FOOTWAY`

  return `${fromStationId}-${toStationId}-${part.label.split('-')[0]}` // for dealing with the SEV case...
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
// takes a coord string, say '123.456,456.789', and return [123.456,456.789]
export const coordsStringToCoord = (cs) => {
  let parts = cs.split(',')
  return [parseFloat(parts[0]),parseFloat(parts[1])]
}
// given a list of coords (float,float)!, find the closest one to the given point(dist)
// use L1 distance
// O(n): scan for each coord, mark the closest one's index, and return it
export const getIndexOfClosestCoords = (coords, sample) => {
  let dists = coords.map((coord) => Math.abs(coord[0] - sample[0]) + Math.abs(coord[1] - sample[1]))
  let min = Infinity,argmin = -1
  dists.forEach((dist,i) => {
    if(dist < min) {
      min = dist
      argmin = i
    }
  })
  return argmin
}

// given an item, find the coordinates of the smooth path
/*
  To do this
  a. first find the coorespondece of the latlng of stations and the weird coordinates from mvv
  b. then get the line segment of between from each station parts
  c. apply the transformation to each of the point, and return the result...
*/
export const getSmoothPathCoordsInLatLng = (items,mvvStationParts,mvgStationList) => {
  // a. first of all, gather the correspondence
  // a.1. I need a list of [[latlng],[weirdCoords]] for each station
  let getCorrespondences = (mvgId) => {
    let mvvStation = items.points.find(mvv => parseInt(mvv.ref.id) % 1e5 == mvgId)
    let mvgStation = mvgStationList.find(mvg => mvg.id == mvgId)
    if(!mvvStation || !mvgStation) throw(`no correspondence for ${mvgId}`)
    // assume theres such station...
    let weirdCoords  = coordsStringToCoord(mvvStation.ref.coords)
    let latlngCoords = [mvgStation.latitude,mvgStation.longitude]
    return {latlng:latlngCoords,weird: weirdCoords}
  }

  // a.2. I need to find a Matrix A so that A * (weirdCoords) = latlng, by minimizing this Ax = b problem, iteratively...
  // <stroke>but lets try something easier first: just find a correspondence using the from station and to station</stroke>
  // The above doesn't work, lets try plan B:
  // for each stations at the middle, approximate the path points between them as linear, then apply them individually to the points in between

  // matrix are in major order, say x[0][1] is the element at 0-th row, 1-st column
  let
      // x = [
      //       [correspondences[0].weird[0], correspondences[1].weird[0] ],
      //       [correspondences[0].weird[1], correspondences[1].weird[1] ]
      //     ],
      // b = [
      //       [correspondences[0].latlng[0], correspondences[1].latlng[0] ],
      //       [correspondences[0].latlng[1], correspondences[1].latlng[1] ]
      //     ],
      det = (mat) => mat[0][0] * mat[1][1] - ( mat[0][1] * mat[1][0]),
      // inverse of a 2*2 mat
      inv = (mat) => {
        let d = det(mat)
        if(d == 0) throw('singular matrix')// singular - but unlikely since the coordinates can't be the same - unless you pass the same station twice...
        return [
          [ mat[1][1] / d,-mat[0][1] / d], // d ,-b
          [-mat[1][0] / d, mat[0][0] / d]  // -c, a
        ]
      },
      // multiplication of 2 2x2 matrices
      mul = (ma,mb) => {
        return [
          [ma[0][0] * mb[0][0] + ma[0][1] * mb[1][0], ma[0][0] * mb[0][1] + ma[0][1] * mb[1][1] ],
          [ma[1][0] * mb[0][0] + ma[1][1] * mb[1][0], ma[1][0] * mb[0][1] + ma[1][1] * mb[1][1] ]
        ]
      },
      // multiplcation of 2x2 matrices to a 2x1 vector: Ax
      mul2To1 = (ma,v) => {
        return [
          [ma[0][0] * v[0] + ma[0][1] * v[1]],
          [ma[1][0] * v[0] + ma[1][1] * v[1]]
        ]
      },
      // the linear transform we wanted!
      getRelationMatrix = (b,x) =>  mul(b,inv(x))

  // b. find the list of [weirdCoords] between fromStationId to toStationId, this can be solved by direct inverse...
  // b.1. find the closest coordinates in the smooth coord to the tip of the stations...
  let smoothWeirdCoords = items.paths[0].path.split(' ').map(coordsStringToCoord),
      /*
        function for getting the smooth line segment between two points
        we do the same thing with the alg. that finds a transformation matrix using the correspondence of 2 endpoints,
        just that we apply it piecewise, so that one matrix is obtained for each space between two stations.
        The station's latlng will not be changed even without specifiing them explicitly
        because all matrices found are using the station's correspondences as clue,
        so the true latlng of the stations will be recovered by each of the matrices
      */
      getSmoothLineSegment = (stationsAId,stationsBId) => {
        let correspondences = [stationsAId,stationsBId].map(getCorrespondences)
        if(correspondences.some(corr => ! corr)) return null // sorry some of them cannot be converted...
        let
            x = [
                  [correspondences[0].weird[0], correspondences[1].weird[0] ],
                  [correspondences[0].weird[1], correspondences[1].weird[1] ]
                ],
            b = [
                  [correspondences[0].latlng[0], correspondences[1].latlng[0] ],
                  [correspondences[0].latlng[1], correspondences[1].latlng[1] ]
                ],
            fromIndsInSmoothWeirdCoords = getIndexOfClosestCoords(smoothWeirdCoords,correspondences[0].weird),
            toIndsInSmoothWeirdCoords   = getIndexOfClosestCoords(smoothWeirdCoords,correspondences[1].weird),
            // b.2 figure out which side has a larger index, and flip it accordingly
                applyIndices = ((fromIndsInSmoothWeirdCoords < toIndsInSmoothWeirdCoords)?
                  [fromIndsInSmoothWeirdCoords,toIndsInSmoothWeirdCoords]:
                  [toIndsInSmoothWeirdCoords,fromIndsInSmoothWeirdCoords]),
                // then slice the smooth weird coords to ge the segments between from-to stations
                smoothWeirdCoordsSegment = smoothWeirdCoords.slice(...applyIndices),
            // b.3 prepend & append the to stations' coordinates in
                finalWeirdCoordsSegment = [
                  correspondences[0].weird,
                  ...smoothWeirdCoordsSegment,
                  correspondences[1].weird]
            // c. transform the segment of weird coordinate to latlng coordinate
            let latLngSegment = finalWeirdCoordsSegment.map(
              weird => mul2To1(getRelationMatrix(b,x),weird))
            // ...and return
            // why flatten? because it'a a column vector 2 * 1!
            return latLngSegment.map(latlng => flattenList(latlng))
      }
      // now get smooth line segment between stations...
      let results = []
      for(let i = 0; i < mvvStationParts.length - 1; i++) {
        let segment = getSmoothLineSegment(
          ...mvvStationParts.slice(i,i + 2)
            .map(part => parseInt(part.ref.id) % 1e5))
        results = results.concat(segment)
      }
      return results

}
