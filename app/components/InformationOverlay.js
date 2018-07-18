import React from 'react'
import PropTypes from 'prop-types';
import style from './Style.js';
import { DotLoader } from 'react-spinners';
export default class InformationOverlay extends React.Component {

  getMainIconElement() {
    if(this.props.overlayType == 'loading') {
      return ( <DotLoader color={'#ffffff'} loading={true}/> )
    }
    return <p> Error! </p>
  }
  render() {
      return (
        <div style={style.loadingOverlayStyle}>
          <div style={style.loadingOverlayStyle.spinnerContainer}>
            {this.getMainIconElement()}
          </div>
          <p>{this.props.title}</p>
        </div>
      )
  }
}

InformationOverlay.propTypes = {
  title: PropTypes.string,
  overlayType: PropTypes.oneOf(['loading','error']).isRequired,
}
