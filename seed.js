const {db, Scenario} = require('./server/db')
const {green, red} = require('chalk')
const seedScenarios = require('./seed-scenarios.json')


const seed = async () => {
  try { await db.sync({force: true})

  // seed your database here!
  
  await Promise.all(seedScenarios.map(scenario => Scenario.create(scenario)))

  console.log(green('Seeding Scenarios success!'))
  
  db.close()
  }
  catch (err) {
    console.error(err)
  }
}

seed()
  .catch(err => {
    console.error(red('Oh noes! Something went wrong!'))
    console.error(err)
    db.close()
  })
