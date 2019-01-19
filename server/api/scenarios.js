const router = require('express').Router()
const {Scenario} = require('../db')

// GET /api/scenarios/
router.get('/', async (req, res, next) => {
  try {
    const response = await Scenario.findAll();
    res.send(response)
  }
  catch (error) {
    next(error)
  }
})

// GET /api/scenarios/:scenarioId

router.get('/:scenarioId', async (req, res, next) => {
  try {
    const response = await Scenario.findById(req.params.scenarioId);
    res.send(response)
  }
  catch (error) {
    next(error)
  }
})


module.exports = router
