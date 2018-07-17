// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import mvg from './mvg'

const rootReducer = combineReducers({
  counter,
  mvg,
  router
});

export default rootReducer;
