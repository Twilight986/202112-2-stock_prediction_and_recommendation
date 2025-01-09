import {applyMiddleware, createStore, compose, combineReducers} from 'redux';
import createLogger from 'redux-logger';
import globalConfig from 'config.js';
import Sidebar from './Sidebar.js';
import Login from './Login.js';

const logger = createLogger();
let middleware;
if (globalConfig.debug) {
  middleware = applyMiddleware(logger);
} else {
  middleware = applyMiddleware();
}

const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify here name, actionsBlacklist, actionsCreators and other options
    }) : compose;
const enhancer = composeEnhancers(
  middleware,
  // other store enhancers if any
);


const initState = {
  Sidebar: Sidebar.initState,
  Login: Login.initState,
};


const reducers = {
  Sidebar: Sidebar.reducer,
  Login: Login.reducer,
};

const store = createStore(combineReducers(reducers), initState, enhancer);

export default store;
