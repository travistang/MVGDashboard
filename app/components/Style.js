// common styles
let centerContentStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

export default {
  centerContentStyle,
  stationCard: {
    width: "100%",
    // maxHeight: "72px",
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid white",

    leftContainer: {
      display: "flex",
      flexDirection: "column",
      flex: 3,
      marginBottom: "4px",
      tokenList: {
        display: "flex",
        justifyContent: "spaceAround",
        alignItems: "flexStart"
      }
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
    // position: "absolute",
    height: "100%",
    top: 0,
    width: "100%",
    bottom: 0,
    left: 0,

    display: "flex",
    flexDirection: "column",

    topContainer: {
      flex: 1,
      display: "flex",
      ...centerContentStyle,

      leftContainer: {
        flex: 3,
        flexDirection: "column",
        paddingLeft: "10%",
      },
      rightContainer: {
        flex: 2,
        flexDirection: "row",
      }
    },
    bottomContainer: {
      flex: 3,
      display: "flex",
      ...centerContentStyle,
    }
  }
}
