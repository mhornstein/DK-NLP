const express = require('express')
const tagRoutes = require('./routes/tagRoutes')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const app = express()

// Configure yargs to parse the command line arguments
const argv = yargs(hideBin(process.argv))
  .option('port', {
    alias: 'p',
    describe: 'Port to run the server on',
    type: 'number',
    default: 3000
  })
  .option('dalUri', {
    alias: 'd',
    describe: 'DAL Service URI',
    type: 'string',
    default: 'http://127.0.0.1:5000'
  })
  .check((argv, options) => {
    if (isNaN(argv.port)) {
      throw new Error('Port must be a number')
    }
    if (argv.port <= 0 || argv.port > 65535) {
      throw new Error('Port must be a valid TCP/IP port (1-65535)')
    }
    return true
  })
  .argv

const port = argv.port
const dalUri = argv.dalUri

// CORS Middleware - TODO configure this more securely in a production environment
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*') // TODO - remove upon production!
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// Use routes
app.use(tagRoutes)

// Inject URIs into routes
const fetchEntriesRoutes = require('./routes/fetchEntriesRoutes')(dalUri)
app.use(fetchEntriesRoutes)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  console.log(`DAL Service URI: ${dalUri}`)
})

module.exports = app
