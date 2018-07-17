// @flow
import React, { Component } from 'react';
import Home from '../components/Home';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

type Props = {};

function mapStateToProps(state) {
  return {
    ...state.clock
  }
}
export default connect(mapStateToProps,null)(Home)
// export default class HomePage extends Component<Props> {
//   props: Props;
//
//   render() {
//     return <Home />;
//   }
// }
