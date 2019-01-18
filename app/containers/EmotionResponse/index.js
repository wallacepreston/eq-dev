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
      <p>You are currently showing me that you are <strong>{currentEmotion}</strong></p>
    );
}

export default EmotionResponse