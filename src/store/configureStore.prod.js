// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import type { counterStateType } from '../reducers/counter';
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas'
const sagaMiddleware = createSagaMiddleware()

const history = createHashHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router,sagaMiddleware);

function configureStore(initialState?: counterStateType) {
  sagaMiddleware.run(rootSaga)
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
