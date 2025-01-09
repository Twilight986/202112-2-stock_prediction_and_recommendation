/**
 * 
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import './utils/index.js'; 
import store from 'redux/store.js';  // redux store

import App from './components/App';
import Welcome from './components/Welcome';
import Error from './components/Error';
import Hello from './components/Hello';
import HoldStock from './components/HoldStock';
import FollowStock from './components/FollowStock';
import News from './components/News';
//import DBTable from './components/DBTable';

const DBTableContainer = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('./components/DBTable').default)
  }, 'DBTable');
};

const routes = (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Welcome}/>

        <Route path="index" tableName="testAction" getComponent={DBTableContainer}/>

        <Route path="alone">
          <Route path="option1" component={Welcome}/>
          <Route path="option2" component={FollowStock}/>
          <Route path="option3" component={HoldStock}/>
        </Route>

        <Route path="headerMenu3" component={News} />

        <Route path="*" component={Error}/>

      </Route>
    </Router>
  </Provider>
);

ReactDOM.render(routes, document.getElementById('root'));
