

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

