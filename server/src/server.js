const express = require('express')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express')
const swaggerUtil = require('./swagger/swaggerUtil')

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
    default: '127.0.0.1:5000'
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
  .option('taggerUri', {
    alias: 't',
    describe: 'Tagger Service URI',
    type: 'string',
    default: '127.0.0.1:4000'
  })
  .option('enable-api', {
    alias: 'e',
    describe: 'Enable Swagger API documentation',
    type: 'boolean',
    default: false
  })
  .argv

const port = argv.port
const dalUri = argv.dalUri
const taggerUri = argv.taggerUri
const enableApi = argv['enable-api']

// Add morgan for logging requests and responses to console
app.use(morgan('dev'))

// CORS Middleware - TODO configure this more securely in a production environment
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*') // TODO - remove upon production!
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// Inject URIs into routes
const fetchEntriesRoutes = require('./routes/fetchEntriesRoutes')(dalUri)
app.use(fetchEntriesRoutes)

const tagRoutes = require('./routes/tagRoutes')(taggerUri, dalUri)
app.use(tagRoutes)

// lunch swagger if required
if (enableApi) {
  const swaggerConfig = swaggerUtil.generateSwaggerConfig(port)
  app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerConfig))
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  console.log(`DAL Service URI: ${dalUri}`)
  console.log(`Tagger Service URI: ${taggerUri}`)
  if (enableApi) {
    console.log(`Swagger API documentation is available at http://localhost:${port}/apidocs`)
  }
})

module.exports = app
