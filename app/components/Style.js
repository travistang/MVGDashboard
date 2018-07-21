// common styles
let centerContentStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

let underlineStyle = {
  borderBottom: "1px solid white"
}

let tokenList = {
    display: "flex",
    justifyContent: "spaceAround",
    alignItems: "flexStart"
}
export default {
  tokenList,

  departureCard: {
    display: 'flex',
    flexDirection: 'row',
    height: "72px",
    leftColumn: {
      flex: 1,
      justifyContent: 'center',
      alignItems:'center'
    },
    middleColumn: {
      flex: 4,

      display: 'flex',
      flexDirection: 'column',
      upperRow: {
        flex: 1,
        fontWeight: "bold",
        display: "flex",
        flexDirection: "row"
      },
      lowerRow: {
        flex: 1,
        fontSize: '12px',
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

  },

  lineTag: {

    height: "16px",
    width: "24px",
    margin: "4px",
    fontSize: "9px",
    fontWeight: "bold",
    ...centerContentStyle,
  },
  centerContentStyle,
  imageWithText: {
    display: "flex",
    margin: "24px",
    flexDirection: "column",
    textAlign: "center",
    ...centerContentStyle,
  },
  stationCard: {
    width: "100%",
    // maxHeight: "72px",
    display: "flex",
    flexDirection: "row",
    ...underlineStyle,

    leftContainer: {
      display: "flex",
      flexDirection: "column",
      flex: 3,
      marginBottom: "4px",
      tokenList,

    },
    rightContainer: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      ...centerContentStyle
    }
  },
  loadingOverlayStyle: {
    ...centerContentStyle,

    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",


    flexDirection: "column",
    zIndex: 1001,
    backgroundColor: "rgba(0,0,0,0.5)",

    spinnerContainer: {
        height: "64px",
        width: "64px",

    }
  },

  mainContainer: {
    position: "absolute",

    top: "62px", // this is the offset for the nav bar
    width: "100%",
    bottom: 0,
    left: 0,

    display: "flex",
    flexDirection: "row",

    leftContainer: {
      flex: 1,
      display: "flex",
      ...centerContentStyle,
      flexDirection: "column",
      topContainer: {
        flex: 1,
        flexDirection: "column",
        // paddingLeft: "10%",
        ...underlineStyle,
      },
      bottomContainer: {
        flex: "7 1 75%", // 80% of the basis
        flexDirection: "column",
        display: "flex"
      }
    },
    rightContainer: {
      flex: 1,
      display: "flex",

      ...centerContentStyle,
      flexDirection: "column",
      topContainer: {
        flex: 1,
        alignText: 'center',
        width: "100%",
        marginBottom: "16px",
      },
      middleContainer: {
        flex: "4",
        width: "100%",
      },
      bottomContainer: {
        flex: "1",
        width: "100%"

      }
    }
  }
}
