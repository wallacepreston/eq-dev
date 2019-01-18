/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React from 'react';

const EmotionResponse = (props) => {
  const {currentEmotion} = props
    return (
      <div>
        <h4>Your Current Response:</h4>
        <h2>You are currently showing me that you are <u>{currentEmotion}</u></h2>
      </div>
    );
}

export default EmotionResponse