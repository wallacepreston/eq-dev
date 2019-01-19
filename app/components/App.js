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
import NavBar from './NavBar';
import Home from './Home';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <Switch>
          <Route path='/learn' render={() => <Learn/>}/>
          <Route exact path='/' render={() => <Home/>}/>
          <Route path='*' render={() => <NotFound/>}/>
        </Switch>
      </div>
    );
  }
}
