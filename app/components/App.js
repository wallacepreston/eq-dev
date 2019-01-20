/*
 *
 * App
 *
 */

import React, {Component} from 'react';
import { Switch, Route, withRouter} from 'react-router-dom';

import Learn from './Learn';
import NotFound from './NotFound';

import './style.css';
import './styleM.css';
import NavBar from './NavBar';
import Home from './Home';
import WelcomeToGame from './WelcomeToGame';
import SingleScenario from './SingleScenario';

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <Switch>
          <Route exact path='/learn' component={WelcomeToGame} /> {/* Omri intro, and something about how the video/emotion thing works. */}
          <Route exact path='/learn/scenarios/:scenarioId' component={SingleScenario} /> {/* Each scenario will have its own URL, and the game will display inside there. */}
          <Route exact path='/' render={() => <Home/>}/>
          {/* <Route exact path='/learn/scenarios/:scenarioId' component={SingleScenario} /> */}
          <Route path='*' render={() => <NotFound/>}/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App)