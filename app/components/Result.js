import React from 'react';

const Result = (props) => {
  const {scenario, successfulEmotion, updateScore} = props
    return (
      <div>
        <h4>Result</h4>
        
        <h2>
          {scenario.correctEmotion === successfulEmotion
          ?
          (
          <div>
            {updateScore('correct')}
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