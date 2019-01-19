import React from 'react';

const Result = (props) => {
  const {correctEmotion, successfulEmotion, updateScore} = props
    return (
      <div>
        <h4>Result</h4>
        <audio
              controls
              src="/1_person_cheering-Jett_Rifkin-1851518140.mp3" 
              autoPlay
            />
        
        <h2>
          {correctEmotion === successfulEmotion
          ?
          (
          <div>
            {updateScore('correct')}
            <audio
              
              src="http://www.pacdv.com/sounds/people_sound_effects/yes_1.wav" 
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