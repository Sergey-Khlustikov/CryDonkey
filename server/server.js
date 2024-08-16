const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { run: runRcade } = require('./automatization/rcade/index.js')
const { run: runSwan } = require('./automatization/swan/swan.js')

const app = express()

// Middleware
app.use(bodyParser.json())
app.use(cors())

app.get('/status', async function (req, res) {
  res.send('Everything is OK')
})

function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

app.post('/runRcade', async (req, res) => {
  try {
    await runRcade(shuffleArray(req.body.profileIds))
    res.status(200).send('Rcade run successfully')
  } catch (error) {
    res.status(500).send('Error running Rcade: ' + error.message)
  }
})

app.post('/runSwan', async (req, res) => {
  try {
    await runSwan({
      profileIds: shuffleArray(req.body.profileIds),
      dailyFirst: req.body.dailyFirst,
      dailySecond: req.body.dailySecond,
      dailyThird: req.body.dailyThird,
      onlyDaily: req.body.onlyDaily
    })
    res.status(200).send('Swan run successfully')
  } catch (error) {
    res.status(500).send('Error running Swan: ' + error.message)
  }
})

module.exports = app

// // Запуск сервера
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`)
// })
