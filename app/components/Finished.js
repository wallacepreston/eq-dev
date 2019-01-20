

import React from 'react';
import {Link,withRouter} from 'react-router-dom'

const Finished = (props) => {
    return (
      <div>
        <h4>Finished</h4>
        <h2>
          You're all done.
        </h2>
        <a href="/learn" >Start Over</a> | <a href="/" >Go Home</a>
        
      </div>
    );
}

export default Finished

