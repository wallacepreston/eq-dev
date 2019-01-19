/*
 *
 * App
 *
 */

import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';

import Learn from './Learn';
import NotFound from './NotFound';

import './style.css';
import './styleM.css';

export default class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route path='/learn' render={() => <Learn/>}/>
        <Route path='*' render={() => <NotFound/>}/>
      </Switch>
    );
  }
}
