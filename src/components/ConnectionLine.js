import React from 'react'
import * as Utils from '../utils/utils'
import LineTag from './LineTag'
/*
  Props:
    connection: the connection object,
    which has the connectionPartList object

    (optional) lineWidth: the width of line, in px
    (optional) stationPointWidth: size (height and width) of the station "circle"
*/

const style = {
  connectionLineContainer: {
    display: 'flex',
    height: '100%',
    left: {
      display: 'flex',
      flexDirection: 'column',
      flex: 2,
    },
    right: {
      display: 'flex',
      flexDirection: 'column',
      flex: 5,
    }
  },
  lineComponent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    // for squeezing the "line" to the middle
    space: {
        flex: 1
    }
  },
  stationComponent: {
    middle: {
      display: 'flex',
      flex: '1',
      alignItems: 'center',
      justifyContent: 'center',

    }
  }
}
export default class ConnectionLine extends React.Component {

  constructor(props) {
    super(props)
    // some common config here
    this.lineWidth = this.props.lineWidth || 6
    this.stationPointWidth = this.props.stationPointWidth || 24
  }
  // return a line component
  // which should look like "   |   ",
  // the spaces on the left and right are "filled" by two empty flexbox
  // the "line" at the middle is actually a div filled with color, with width "lineWidth"
  lineComponent(color) {
    let lineStyle = {
      flex: `0 0 ${this.lineWidth}px`,
      background: color
    }
    return (
      <div style={style.lineComponent}>
        <div style={style.lineComponent.space}/>
        <div style={lineStyle} />
        <div style={style.lineComponent.space}/>
      </div>
    )
  }
  /*
    return a station component that look like:
    "  |     <- only when "headColor"
       O     time,Station info blah blah
       |   " <- only when "tailColor"
  */

  stationComponent(color,headColor = null,tailColor = null) {
    const containerStyle = {
      flex: `0 0 ${this.stationPointWidth}px`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
    const stationStyle = {
      background: 'transparent',
      minHeight: this.stationPointWidth,
      minWidth: this.stationPointWidth,

      maxHeight: this.stationPointWidth,
      maxWidth: this.stationPointWidth,
      borderRadius: this.stationPointWidth / 2,
      border: `${this.lineWidth}px solid ${color}`
    }
    return (
      <div style={containerStyle}>
        <div style={stationStyle}/>
      </div>

    )
  }
  render() {
    let connection = this.props.connection
    if(!connection || !connection.connectionPartList || !connection.connectionPartList.length) return null
    return (
      <div style={style.connectionLineContainer}>
        <div style={style.connectionLineContainer.left}>
        {
          Utils.flattenList(
            // for each part the map below should give either 2 or 3 components
            // when its first part it gives 3, otherwise it gives 2
            connection.connectionPartList.map((part,i) => {
            // TODO: give the part..
              let color = Utils.getColor(part.label),
                  nextColor = (i == connection.connectionPartList.length - 1)?
                    null:Utils.getColor(connection.connectionPartList[i + 1].label)
                    // try to see whats the label of the next component,
                    // if theres none then leave it as null, otherwise give the lower part of the second station to the next color
                    /*
                        Like this:
                            |
                            O
                            1   <- another color
                    */
              // deal with the head case first...
              if (i == 0) return [
                /*
                    O
                    |
                */
                this.stationComponent(color,null,color),
                this.lineComponent(color),
                this.stationComponent(color,color,nextColor)
                /*
                    |
                    O
                */
              ]
              else if(i != connection.connectionPartList.length - 1)return [
                this.lineComponent(color),
                this.stationComponent(color,color,nextColor)
              ]
              else return [
                this.lineComponent(color),
                this.stationComponent(color,color,null)
              ]

            })
          )
        }
        </div>
        {/* The Right container: contains the info and such*/}

        <div style={style.connectionLineContainer.right}>
          {
            Utils.flattenList(
              connection.connectionPartList.map((part,i) => {
                /*
                  If the part is not the last one (i != numParts - 1), there should be two components,
                  -  one next to the station,
                     with the same height with the station dots,
                  -  a container with flex 1, which shows the direction and line
                  Otherwise there should be three:
                  - The first two are the same with the above,
                  - The last would be the info and arrival time of the last stop.
                */
                let color = Utils.getColor(part.label),
                lineTag = <LineTag backgroundColor={color} line={part.label} />,
                timeWithStationNameStyle = {
                  flex: `0 0 ${this.stationPointWidth}px`,
                  display: 'flex',
                  time: {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  },
                  stationName: {
                    flex: 3
                  }
                },
                lineNameDirectionStyle = {
                  flex: '1',
                  display: 'flex',
                  alignItems: 'center' // put the info at the middle
                },

                commonComponents = [
                  <div style={timeWithStationNameStyle}>
                    <div style={timeWithStationNameStyle.time}>
                      <b>{Utils.unixTimeStampToDateHHMM(part.departure)}</b>
                      {
                        // here displays the waiting time
                        i > 0 && (
                          <div className="text-danger">
                            (
                              <span className="glyphicon glyphicon-time" aria-hidden="true"></span>
                              {Utils.timeDifferenceFormatString(
                                connection.connectionPartList[i - 1].arrival,
                                part.departure
                              )}
                            )
                          </div>
                        )
                      }

                    </div>
                    <div style={timeWithStationNameStyle.stationName}>
                      {part.from.name}
                    </div>
                  </div>,

                  <div style={lineNameDirectionStyle}>
                    {lineTag} {part.destination}
                  </div>
                ]

                if(i != connection.connectionPartList.length - 1) {
                  return commonComponents
                } else {
                  // the last comonent: at the extra one
                  return [
                    ...commonComponents,
                    <div style={timeWithStationNameStyle}>
                      <div style={timeWithStationNameStyle.time}>
                        {Utils.unixTimeStampToDateHHMM(part.arrival)}
                      </div>
                      <div style={timeWithStationNameStyle.stationName}>
                        {part.to.name}
                      </div>
                    </div>
                  ]
                }
              })
            )
          }
        </div>
      </div>
    )
  }
}
