'use strict'

const db = require('./database')

// The purpose of this module is to bring our Sequelize instance (`db`) together
// with our models (which we should define in separate modules in this directory).

// REQUIRE IN OTHER MODELS

const Scenario = require('./scenarios')

// ASSOCIATIONS

module.exports = {
  // Include your models in this exports object as well!
  db,
  Scenario
}
