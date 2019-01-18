/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React from 'react';
import EmotionResponse from './EmotionResponse';
import Prompt from './Prompt';
import Result from './Result'

const Game = (props) => {
  const {currentEmotion, scenario, successfulEmotion} = props
    return (
      <div>
        <Prompt prompt={scenario.prompt}/>
        <EmotionResponse currentEmotion={currentEmotion}/>
        <Result correctEmotion={scenario.correctEmotion} successfulEmotion={successfulEmotion}/>
      </div>
    );
}

export default Game