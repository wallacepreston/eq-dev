
import 'babel-polyfill'
import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import {withRouter, Switch, Route} from 'react-router-dom';
import axios from 'axios';

import clm from 'clmtrackr';

import emotionClassifier from '../../internals/scripts/models/emotionclassifier';
import emotionModel from '../../internals/scripts/models/emotionmodel.js';
import pModel from '../../internals/scripts/models/pmodel.js';
import {fetchScenarios, fetchScenario} from '../reducers'

import Stats from 'stats-js';
import * as d3 from "d3";

import './style.css';
import './styleM.css';

import Game from './Game';
import Finished from './Finished';
import WelcomeToGame from './WelcomeToGame';
import SingleScenario from './SingleScenario';

// dummy data for the game
const dummyScenarios = [
  {
    prompt: 'Your coworker tells you her dog is sick.',
    correctEmotion: 'sad'
  },
  {
    prompt: 'Your boss says he is going to the mountains to ski next weekend. He shows you his brand-new powder skis',
    correctEmotion: 'surprised'
  },
  {
    prompt: 'Your coworker just got a promotion, even though you did not.',
    correctEmotion: 'happy'
  },
  {
    prompt: 'Your friend just got stung by a bee. She is crying.',
    correctEmotion: 'sad'
  }
]
const gottenScenario = {
  prompt: 'Your coworker tells you her dog is sick.',
  correctEmotion: 'sad'
}



var ec = new emotionClassifier();
ec.init(emotionModel);
var emotionData = ec.getBlank();

/************ d3 code for barchart *****************/

var margin = {top : 20, right : 20, bottom : 10, left : 40},
width = 400 - margin.left - margin.right,
height = 100 - margin.top - margin.bottom;

var barWidth = 30;

var formatPercent = d3.format(".0%");

var x = d3.scaleLinear()
.domain([0, ec.getEmotions().length]).range([margin.left, width+margin.left]);

var y = d3.scaleLinear()
.domain([0,1]).range([0, height]);

var svg = d3.selectAll("#emotion_chart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)

svg.selectAll("rect").
data(emotionData).
enter().
append("svg:rect").
attr("x", function(datum, index) { return x(index); }).
attr("y", function(datum) { return height - y(datum.value); }).
attr("height", function(datum) { return y(datum.value); }).
attr("width", barWidth).
attr("fill", "#2d578b");

svg.selectAll("text.labels").
data(emotionData).
enter().
append("svg:text").
attr("x", function(datum, index) { return x(index) + barWidth; }).
attr("y", function(datum) { return height - y(datum.value); }).
attr("dx", -barWidth/2).
attr("dy", "1.2em").
attr("text-anchor", "middle").
text(function(datum) { return datum.value;}).
attr("fill", "white").
attr("class", "labels");

svg.selectAll("text.yAxis").
data(emotionData).
enter().append("svg:text").
attr("x", function(datum, index) { return x(index) + barWidth; }).
attr("y", height).
attr("dx", -barWidth/2).
attr("text-anchor", "middle").
attr("style", "font-size: 12").
text(function(datum) { return datum.emotion;}).
attr("transform", "translate(0, 18)").
attr("class", "yAxis");


/******** stats ********/

const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.dom );

// update stats on every iteration
document.addEventListener('clmtrackrIteration', function(event) {
stats.update();
}, false);

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
    const {data} = await axios.get('/api/scenarios');
    this.setState({
      scenarios: data,
      scenario: dummyScenarios[0],
      vid:vid
    }, () => {
      this.setState({
        vidWidth:vid.width,
        vidHeight:vid.height,
        overlay:overlay,
        overlayCC:overlayCC
      })
    })
    const scenariosList = this.state.scenarios
    this.setState({
      scenario: scenariosList[0],
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
      this.updateData(er);
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

  updateData(data) {
    // update
    var rects = svg.selectAll("rect")
      .data(data)
      .attr("y", function(datum) { return height - y(datum.value); })
      .attr("height", function(datum) { return y(datum.value); });
    var texts = svg.selectAll("text.labels")
      .data(data)
      .attr("y", function(datum) { return height - y(datum.value); })
      .text(function(datum) { return datum.value.toFixed(1);});

    // enter
    rects.enter().append("svg:rect");
    texts.enter().append("svg:text");

    // exit
    rects.exit().remove();
    texts.exit().remove();
  }

  nextScenario() {
    let newIdx = this.state.scenariosIdx + 1
    let newScenario = this.state.scenarios[newIdx]
    
    this.setState({
      scenariosIdx: newIdx,
      scenario: newScenario,
      successfulEmotion: ''
    })
  }

  // updateScore(result){
  //   const newSingleScore = this.state.score[result] + 1
  //   if(result === 'correct'){
  //     this.setState({
  //       score:{
  //         ...this.state.score,
  //         correct: newSingleScore
  //       }
  //     })
  //   }
  //   else {
  //     this.setState({
  //       score:{
  //         ...this.state.score,
  //         incorrect: newSingleScore
  //       }
  //     })
  //   }
  // }


  render() {
    return (
      <div className="container">
        <Helmet title="Learn - Dev EQ" meta={[ { name: 'description', content: 'Description of Home' }]}/>
        <Switch>
          <Route exact path='/learn' component={WelcomeToGame} /> {/* Omri intro, and something about how the video/emotion thing works. */}
          <Route exact path='/learn/scenarios/:scenarioId' component={SingleScenario} /> {/* Each scenario will have its own URL, and the game will display inside there. */}
        </Switch>
        
        <div className="row">
          <div className="col">
            <h1>Omri</h1>
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
                    <h2>You should be <u>{this.state.successfulEmotion}</u> in this case!</h2>
                </div>
              )
              :
                ('')
              }

            </div>
          </div>
          <div className="col">
          <h1>Video</h1>
        <div id="container">
        
				  <video id="videoel" width="400" height="300" preload="auto" loop playsInline autoPlay></video>
          <canvas id="overlay" width="400" height="300"></canvas>
          
          <input className="btn" type="button" value={this.state.startValue} disabled={this.state.startDisabled} onClick={this.startVideo} id="startbutton"></input>
			  </div>
        <div id="emotion_container">
          <div id="emotion_icons">
            <img className="emotion_icon" id="icon-angry" src="https://www.auduno.com/clmtrackr/examples/media/icon_angry.png" />
            <img className="emotion_icon" id="icon-sad" src="https://www.auduno.com/clmtrackr/examples/media/icon_sad.png"/>
            <img className="emotion_icon" id="icon-surprised" src="https://www.auduno.com/clmtrackr/examples/media/icon_surprised.png"/>
            <img className="emotion_icon" id="icon-happy" src="https://www.auduno.com/clmtrackr/examples/media/icon_happy.png"/>
          </div>
          <div id='emotion_chart'></div>
          {this.state.scenariosIdx < this.state.scenarios.length
          ?
          (
            <div>
              <Game currentEmotion={this.state.currentEmotion} scenario={this.state.scenario} successfulEmotion={this.state.successfulEmotion} nextScenario={this.nextScenario}/>
            </div>
          )
          :
          <Finished />
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
