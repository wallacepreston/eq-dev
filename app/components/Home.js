

import React from 'react';
import { Link } from 'react-router-dom';
import '../../public/style-home.css'

export default class Home extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <header className="masthead d-flex">
      <div className="container text-center my-auto">
        <h1 className="mb-1">Dev-EQ</h1>
        <h3 className="mb-5">
          <em>Helping Developers Emote</em>
        </h3>
        <div className="btn-container">
        <Link to="/learn"><button type="button" className="btn btn-primary btn-lg btn-xl center-block">Learn Now!</button></Link>
        </div>
      </div>
      <div className="overlay"></div>
    </header>
    );
  }
}
