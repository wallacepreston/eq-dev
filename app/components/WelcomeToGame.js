import React from 'react';
import {Link, withRouter} from 'react-router-dom'

const WelcomeToGame = (props) => {
    return (
      <div className="container">
        <audio
          src="/audio/today-were-going-to-learn-about.mp3" 
          autoPlay
        />

        <div>
          <h1>Hi! I'm Omri.</h1>
          <img src="/omri/hello-wave.jpg" />
          <h2>Today, we're going to learn about emotions.</h2>
        </div>
        <Link to="/learn/scenarios/1"><button type="button" className="btn btn-primary btn-lg btn-xl center-block">Let's Go!</button></Link>
      </div>
    );
}

export default withRouter(WelcomeToGame)
