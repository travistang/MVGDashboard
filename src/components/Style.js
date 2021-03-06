// common styles
let color = {
  blue: "#375a7f",
  indigo: "#6610f2",
  red: "#E74C3C",
  green: "#00bc8c"
}
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
let cell = {
  ...centerContentStyle,
  display: "flex",
  flexDirection: "column",
  width: 40,
  height: 40,
  padding: 4,
  fontWeight: "bold"
}

export default {
  tokenList,
  watchingDeparture: {
    backgroundColor: color.green,
    width: '100%'
  },
  app: {
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden"
  },
  modal: {

    container: {
      display: "flex",
      flexDirection: "column",
      inputField: {
        flex: "0 0 20%",
        paddingBottom: 16,
      },
      map: {
        paddingTop:16,
        flex: "0 0 80%",
      }
    }
  },
  tooltip: {

    container: {
      // width: 120,
      ...centerContentStyle,
      flexDirection: "column",
      overview: {
        flex: 1,
      },
      departureTime: {
        flex: 1,
        display: "flex",
        justifyContent:"space-between",

        left: {
          ...cell,
          borderRight: "1px solid #333"
        },
        right: {
          ...cell,
          borderLeft: "1px solid #333",
        },
        center: {
          ...cell
        }
      }
    },
  },
  stationSelection: {
    display: "flex",
    labels: {
      flex: 1,
      display: "flex",
      flexWrap: "wrap",
      color: "white"
    },
    name: {
      flex: 1,
      textTransform: "capitalize",
      ...centerContentStyle
    }
  },
  destinationList: {
    header: {
      display: "flex",
      flex: "0 0 10%",
      justifyContent: "space-between",
      alignItems: "center",

    },
    destinationContainer: {
      margin: 16,
      flex: "0 0 65%"
    },
    pagination: {
      flex: "0 0 10%"
    },

  },
  destinationCard: {
    display: "flex",
    flexDirection:"column",
    transportationList: {
      margin: 8,
    },
    edit: {
      button: {
        padding: 4
      }
    },
    upperRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      remove: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        marginBottom: 8
      },
      left: {
        flex: 3,
        display: "flex",
        alignItems: "center",
        name: {
          paddingLeft: "16px"
        },
      },

      right: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        textAlign: "right",
        up: {
          flex: 1,
          fontWeight: "bold",
        },
        down: {
          flex: 1,
        }
      }
    },
    lowerRow: {
      display: "flex",
      alignItems: "center"
    },
    input: {
      container: {
        position: 'relative',
      },
      input: {
        width: '100%',
        height: "80%",
        padding: '10px 20px',
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
        zIndex: 1000,
        position: 'absolute',
        top: 40,
        width: '100%',
        border: '1px solid #aaa',
        backgroundColor: '#fff',
        color: '#222',
        fontWeight: 300,
        fontSize: 16,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
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
      },
      center: {
        display: 'flex',
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
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
  navBar: {
    location: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  mainContainer: {
    flex: 1,
    // position: "absolute",
    overflowX: "hidden",
    // top: "62px", // this is the offset for the nav bar
    width: "100%",
    bottom: 0,
    left: 0,

    display: "flex",
    flexDirection: "row",

    leftContainer: {
      flex: "0 0 50%",
      display: "flex",
      margin: "1%",
      zIndex: 2,
      ...centerContentStyle,
      flexDirection: "column",
      topContainer: {
        flex: "0 0 144px",
        position: "relative",
        flexDirection: "column",
        width: "100%",
        // paddingLeft: "10%",
        // ...underlineStyle,
        overlay: {
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10000,
          flexDirection: "column",
          // width: "100%",
          // height: "100%",
          padding: '1%',
        }
      },
      bottomContainer: {
        flex: "1 0 80%", // 80% of the basis
        flexDirection: "column",
        width: "100%",
        display: "flex",
        overflowY: "hidden"
      }
    },
    rightContainer: {
      flex: "0 0 50%",
      display: "flex",
      zIndex: 2,
      ...centerContentStyle,
      flexDirection: "column",
      topContainer: {
        flex: 1,
        alignText: 'center',
        width: "100%",
        marginBottom: "16px",
        alignItems: 'center',
        justifyContent: 'flex-start',
        display: 'flex',
      },
      middleContainer: {
        flex: "4",
        width: "100%",
        overflowY: "hidden",
      },
      bottomContainer: {
        flex: "1",
        width: "100%"

      }
    }
  }
}
