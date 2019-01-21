

import 'babel-polyfill'
import React from 'react';
import Helmet from 'react-helmet';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios';
import clm from 'clmtrackr';

import emotionClassifier from '../../internals/scripts/models/emotionclassifier';
import emotionModel from '../../internals/scripts/models/emotionmodel.js';
import './style.css';
import './styleM.css';

import Finished from './Finished';

var ec = new emotionClassifier();
ec.init(emotionModel);

let er
let emotion

class Learn extends React.PureComponent {

  constructor() {
    super();
    this.state = {
      vid:"",
      vidWidth:0,
      vidHeight:0,
      overlay:"",
      overlayCC:"",
      trackingStarted:false,
      startValue:"Waiting",
      startDisabled:true,
      currentEmotion: '',
      scenarios: [],
      scenariosIdx: 0,
      scenario: {},
      successfulEmotion: '',
      // score: {
      //   correct: 0,
      //   incorrect: 0
      // }
    }
    this.nextScenario = this.nextScenario.bind(this)
    // this.updateScore = this.updateScore.bind(this)
  }

  componentWillMount() {
    
    this.ctrack = new clm.tracker();
    this.ctrack.init();
  }

  async componentDidMount() {
    let vid = document.getElementById('videoel');
    let overlay = document.getElementById('overlay');
    let overlayCC = overlay.getContext('2d');
    const {data} = await axios.get(`/api/scenarios/${this.props.match.params.scenarioId}`);
    this.setState({
      scenario: data,
      vid:vid
    }, () => {
      this.setState({
        vidWidth:vid.width,
        vidHeight:vid.height,
        overlay:overlay,
        overlayCC:overlayCC
      })
    })
    
    
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
    // check for camerasupport
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({video : true}).then(this.gumSuccess).catch(this.gumFail);
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia({video : true}, this.gumSuccess, this.gumFail);
    } else {
      alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");
    }
    vid.addEventListener('canplay', this.enablestart, false);
  }

  enablestart = () => {
    this.setState({
      startValue:"Start",
      startDisabled:false
    })
  }

  adjustVideoProportions = () => {
    // resize overlay and video if proportions are different
    // keep same height, just change width

    let vid = this.state.vid;
    let overlay = this.state.overlay;

    let proportion = vid.videoWidth/vid.videoHeight;
    let vidWidth = Math.round(this.state.vidHeight * proportion);

    vid.width = vidWidth;
    overlay.width = vidWidth;

    this.setState({
      vid:vid,
      overlay:overlay
    })
  }

  gumSuccess = ( stream ) => {
    // add camera stream if getUserMedia succeeded
    let vid = this.state.vid;

    if ("srcObject" in vid) {
      vid.srcObject = stream;
    } else {
      vid.src = (window.URL && window.URL.createObjectURL(stream));
    }
    vid.onloadedmetadata = () => {
      this.adjustVideoProportions();
      vid.play();
    }
    vid.onresize = () => {
      this.adjustVideoProportions();
      if (this.state.trackingStarted) {
        this.ctrack.stop();
        this.ctrack.reset();
        this.ctrack.start(vid);
      }
    }
  }

  gumFail = () => {
    alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
  }

  startVideo = () => {
    // start video
    this.state.vid.play();
    // start tracking
    this.ctrack.start(this.state.vid);
    this.setState({
      trackinStarted:true
    })
    // start loop to draw face
    this.drawLoop();
  }

  drawLoop = () => {
    requestAnimationFrame(this.drawLoop);
    this.state.overlayCC.clearRect(0, 0, this.state.vidWidth, this.state.vidHeight);
    if (this.ctrack.getCurrentPosition()) {
      this.ctrack.draw(this.state.overlay);
    }
    let cp = this.ctrack.getCurrentParameters();
    er = ec.meanPredict(cp);
    if (er) {
      
      for (var i = 0;i < er.length;i++) {
        if (er[i].value > 0.4) {
          emotion = er[i].emotion
          this.setState({
            currentEmotion: emotion
          })
          if(this.state.currentEmotion === this.state.scenario.correctEmotion) {
            this.setState({
              successfulEmotion: this.state.currentEmotion
            })
          }
          // console.log('Current Emotion: ', emotion)
          document.getElementById(`icon-${er[i].emotion}`).style.visibility = 'visible';
        } else {
          document.getElementById(`icon-${er[i].emotion}`).style.visibility = 'hidden';
        }
      }
    }
  }

  async nextScenario() {
    this.ctrack.stop();
    this.ctrack.reset();
    let newScenarioId = this.state.scenario.id + 1
    const {data} = await axios.get(`/api/scenarios/${newScenarioId}`);
    this.setState({
      scenario: data,
      currentEmotion: '',
      successfulEmotion: ''
    })
  }


  render() {
    return (
      <div className="container">
        <Helmet title="Learn - Dev EQ" meta={[ { name: 'description', content: 'Description of Home' }]}/>
        <div className="row">
          <div className="col">
            <div id="container">
            
              <video id="videoel" width="400" height="300" preload="auto" loop playsInline autoPlay></video>
              <canvas id="overlay" width="400" height="300"></canvas>
              
            </div>
            <div id="emotion_container">
              <div id="emotion_icons">
                <img className="emotion_icon" id="icon-angry" src="/icon_angry.png" />
                <img className="emotion_icon" id="icon-sad" src="/icon_sad.png"/>
                <img className="emotion_icon" id="icon-surprised" src="/icon_surprised.png"/>
                <img className="emotion_icon" id="icon-happy" src="/icon_happy.png"/>
              </div>
              <div id='emotion_chart'></div>
              <button type="button" className="btn btn-primary btn-sm" value={this.state.startValue} disabled={this.state.startDisabled} onClick={this.startVideo} id="startbutton">Start</button>
              <Link to={`/learn/scenarios/${Number(this.props.match.params.scenarioId) + 1}`}><button type="button" className="btn btn-primary btn-sm" onClick={this.nextScenario}>Next Scenario</button></Link>
              
              {this.state.scenario
              ?
              (
                <div>
                  <h4>
                    {this.state.scenario.prompt}
                  </h4>
                  <div>
                    {this.state.currentEmotion !== '' && this.state.scenario.correctEmotion !== this.state.successfulEmotion
                    ?
                    <div className="alert alert-primary" role="alert">
                      <h4>You are currently showing me that you are <u>{this.state.currentEmotion}</u></h4>
                    </div>
                    :
                    ''
                    }
                  </div>

                  <div id="Omri" width="400" height="300" preload="auto" loop playsInline autoPlay>
                    {!this.state.scenario.correctEmotion === this.state.successfulEmotion && this.state.currentEmotion !== '' 
                    ?
                    (
                      <div>
                        <p>What facial expression should you make in this case?</p> 
                        <h4>
                          Hit 'Start' when you're ready!
                        </h4>
                      </div>
                    )
                    :
                      (
                      ''
                      )
                    }
                  </div>
                  
                  
                </div>
              )
              :
              <Finished />
              }
              
            </div>
          </div>
          <div className="col">
            <div id="Omri" width="400" height="300" preload="auto" loop playsInline autoPlay>
              {this.state.scenario.correctEmotion === this.state.successfulEmotion
              ?
              (
                <div>
                  <img src={this.state.scenario.imageSuccessURL} />
                  <audio
                    src={this.state.scenario.audioSuccessURL} 
                    autoPlay
                  />
                    <h4>Correct!</h4> 
                    <div className="alert alert-primary" role="alert">
                      <h4>You should be <u>{this.state.successfulEmotion}</u> in this case!</h4>
                    </div>
                </div>
              )
              :
                (
                ''
                )
              }
            </div>
          </div>
        </div>
      </div>

      
    );
  }
}


// Helper Functions
/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           return window.setTimeout(callback, 1000/60);
         };
})();

/**
 * Provides cancelRequestAnimationFrame in a cross browser way.
 */
window.cancelRequestAnimFrame = (function() {
  return window.cancelAnimationFrame ||
         window.webkitCancelRequestAnimationFrame ||
         window.mozCancelRequestAnimationFrame ||
         window.oCancelRequestAnimationFrame ||
         window.msCancelRequestAnimationFrame ||
         window.clearTimeout;
})();

export default withRouter(Learn)
