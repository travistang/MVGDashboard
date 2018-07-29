// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import clock from './clock'
import mvg from './mvg'
import destination from './destinations'
import location from './location'
const rootReducer = combineReducers({
  counter,
  mvg,
  clock,
  destination,
  location,
  router
});

export default rootReducer;
