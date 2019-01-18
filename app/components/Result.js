
import React from 'react';

const Result = (props) => {
  const {correctEmotion, successfulEmotion} = props
    return (
      <div>
        <h4>Result</h4>
        <h2>
          {correctEmotion === successfulEmotion
          ? 
          (
          <div>
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