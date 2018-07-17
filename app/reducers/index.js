// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import clock from './clock'
import mvg from './mvg'

const rootReducer = combineReducers({
  counter,
  mvg,
  clock,
  router
});

export default rootReducer;
