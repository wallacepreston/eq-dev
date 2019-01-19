'use strict';

const db = require('./database');
const Sequelize = require('sequelize');
const _ = require('lodash');

const Scenario = db.define('scenario', {
  prompt: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  correctEmotion: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [['angry', 'sad', 'surprised', 'happy']]
    }
  },
  textResultSuccess: {
    type: Sequelize.STRING,
    defaultValue: 'Correct!'
  },
  textResultFailure: {
    type: Sequelize.STRING,
    defaultValue: 'Not quite.'
  },
  imageSuccessURL: {
    type: Sequelize.STRING,
    defaultValue: 'https://no-smoke.org/wp-content/uploads/2018/03/ThumbUpGuy-500x383.jpg'
  },
  imageFailureURL: {
    type: Sequelize.STRING,
    defaultValue: 'https://i.dietdoctor.com/wp-content/uploads/2013/01/confused.bmp?auto=compress%2Cformat&w=600&h=398&fit=crop'
  },
  audioSuccessURL: {
    type: Sequelize.STRING,
    defaultValue: 'http://feeds.soundcloud.com/stream/561263544-user-235075197-correct-great-job-1.mp3'
  },
  audioFailureURL: {
    type: Sequelize.STRING,
    defaultValue: 'http://feeds.soundcloud.com/stream/561267666-user-235075197-incorrect-oh-interesting.mp3'
  }
  
})


module.exports = Scenario;
