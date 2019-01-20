

import React from 'react';
import { Link } from 'react-router-dom';


export default class NavBar extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark bg-primary navbar-expand-md ">
          <div className="nav-item nav-link"><Link to="/">Home</Link></div>
          
          <Link to="/"><span id="nav-logo"><img src="/dev-eq-logo.png" width="40" /></span><div className="navbar-brand">Dev-EQ</div></Link>
          
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
            
              <Link to="/"><div className="nav-item nav-link">Home <span className="sr-only">(current)</span></div></Link>
                
              <Link to="/learn"><div className="nav-item nav-link">Learn</div></Link>
              <div className="nav-item nav-link">Why EQ?</div>
              <div className="nav-item nav-link">About Us</div>
              
            </div>
          </div>
          <div className="navbar-brand my-2 my-lg-0" href="#">Helping Developers Emote</div>
        </nav>
      </div>
    );
  }
}
