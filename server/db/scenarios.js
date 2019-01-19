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
    defaultValue: '/omri/correct-thumbs-up.jpg'
  },
  imageFailureURL: {
    type: Sequelize.STRING,
    defaultValue: '/omri/incorrect-confused.jpg'
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
