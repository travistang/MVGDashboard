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
  destinationCard: {
    input: {
      container: {
        position: 'relative'
      },
      input: {
        width: 240,
        height: "80%",
        padding: '10px 20px',
        fontFamily: 'Helvetica, sans-serif',
        fontWeight: 300,
        fontSize: 16,
        border: '1px solid #aaa',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
      },
      inputFocused: {
        outline: 'none'
      },
      inputOpen: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
      },
      suggestionsContainer: {
        display: 'none'
      },
      suggestionsContainerOpen: {
        display: 'block',
        position: 'absolute',
        top: 40,
        width: 280,
        border: '1px solid #aaa',
        backgroundColor: '#fff',
        color: '#222',
        fontFamily: 'Helvetica, sans-serif',
        fontWeight: 300,
        fontSize: 16,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        zIndex: 2
      },
      suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
      },
      suggestion: {
        cursor: 'pointer',
        padding: '10px 20px'
      },
      suggestionHighlighted: {
        backgroundColor: '#ddd'
      }
    }
  },
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
        width: "100%",
        // paddingLeft: "10%",
        ...underlineStyle,
      },
      bottomContainer: {
        flex: "7 1 75%", // 80% of the basis
        flexDirection: "column",
        width: "100%",
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
