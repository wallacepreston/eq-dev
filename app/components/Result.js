import React from 'react';

const Result = (props) => {
  const {scenario, successfulEmotion, updateScore} = props
    return (
      <div>
        <h4>Result</h4>
        {/* <img src={require('./media/icon_happy.png')} /> */}
        
        <h2>
          {scenario.correctEmotion === successfulEmotion
          ?
          (
          <div>
            {updateScore('correct')}
            <audio
              
              src={scenario.audioSuccessURL} 
              autoPlay
            />

                
              Correct! You should be <u>{successfulEmotion}</u> in this case!
          </div>
          )
          :
          (
            <div>
              Try to guess what emotion you should express!
            </div>
            )
          }
        </h2>
         
      </div>
    );
}

export default Result