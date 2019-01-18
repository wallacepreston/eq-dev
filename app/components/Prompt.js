/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React from 'react';

const Prompt = (props) => {
  const {currentEmotion, prompt} = props
    return (
      <div>
        <h4>Prompt</h4>
        <h2>
          {prompt}
        </h2>
      </div>
    );
}

export default Prompt