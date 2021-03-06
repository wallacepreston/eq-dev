
import React from 'react';
import EmotionResponse from './EmotionResponse';
import Prompt from './Prompt';
import Result from './Result'

const Game = (props) => {
  const {currentEmotion, scenario, successfulEmotion, nextScenario} = props
    return (
      <div>
        <Prompt prompt={scenario.prompt}/>
        <EmotionResponse currentEmotion={currentEmotion}/>
        <Result scenario={scenario} successfulEmotion={successfulEmotion} />
        <button type="button" onClick={nextScenario} >Next Scenario</button>
      </div>
    );
}



export default Game