/*
 *
 * Home
 *
 */

import React from 'react';
import Helmet from 'react-helmet';

import clm from 'clmtrackr';

import emotionClassifier from '../../../internals/scripts/models/emotionclassifier';
import emotionModel from '../../../internals/scripts/models/emotionmodel.js';
import pModel from '../../../internals/scripts/models/pmodel.js';
import Stats from 'stats-js';
import * as d3 from "d3";

import './style.css';
import './styleM.css';

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

export default class Home extends React.PureComponent {

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
      startDisabled:true
    }
  }

  componentWillMount() {
    
    this.ctrack = new clm.tracker();
    this.ctrack.init();
  }

  componentDidMount() {
    let vid = document.getElementById('videoel');
    let overlay = document.getElementById('overlay');
    let overlayCC = overlay.getContext('2d');

    this.setState({
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
    var er = ec.meanPredict(cp);
    if (er) {
      this.updateData(er);
      for (var i = 0;i < er.length;i++) {
        if (er[i].value > 0.4) {
          document.getElementById('icon'+(i+1)).style.visibility = 'visible';
        } else {
          document.getElementById('icon'+(i+1)).style.visibility = 'hidden';
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

  render() {
    return (
      <div className="container">
        <Helmet title="Home" meta={[ { name: 'description', content: 'Description of Home' }]}/>
        <div id="container">
				  <video id="videoel" width="400" height="300" preload="auto" loop playsInline autoPlay></video>
          <canvas id="overlay" width="400" height="300"></canvas>
          
          <input className="btn" type="button" value={this.state.startValue} disabled={this.state.startDisabled} onClick={this.startVideo} id="startbutton"></input>
			  </div>
        <div id="emotion_container">
          <div id="emotion_icons">
            <img className="emotion_icon" id="icon1" src="https://www.auduno.com/clmtrackr/examples/media/icon_angry.png" />
            <img className="emotion_icon" id="icon2" src="https://www.auduno.com/clmtrackr/examples/media/icon_sad.png"/>
            <img className="emotion_icon" id="icon3" src="https://www.auduno.com/clmtrackr/examples/media/icon_surprised.png"/>
            <img className="emotion_icon" id="icon4" src="https://www.auduno.com/clmtrackr/examples/media/icon_happy.png"/>
          </div>
          <div id='emotion_chart'></div>
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
