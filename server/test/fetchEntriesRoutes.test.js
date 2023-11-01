const sinon = require('sinon')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai
chai.use(chaiHttp)

const server = require('../src/server')
const axios = require('../src/util/axiosInstance')
const messages = require('../src/util/messages')

describe('Fetch Entries Route', () => {
  let sandbox

  beforeEach(() => {
    // To mock the axios instance we will use a sinon sandbox
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    // Restore the sandbox after each test
    sandbox.restore()
  })

  it('should return a 200 response when a GET request with mode as "pos" is successful', async () => {
    // Step 1: Mock the axios get method to return a successful response
    const responseData = [{
      _id: '6541ee58581af05899ccf7c6',
      date: 'Wed, 01 Nov 2023 06:21:09 GMT',
      tagged_sentence: [['How', 'WRB'], ['John', 'NNP'], ['is', 'VBZ'], ['doing', 'VBG'], ['in', 'IN'], ['Japan', 'NNP'], ['?', '.']]
    }]
    const axiosGetStub = sandbox.stub(axios, 'get')
    axiosGetStub.resolves({ status: 200, data: responseData })

    // Step 2: Perform a simulated GET request
    const response = await chai.request(server)
      .get('/fetch_entries')
      .query({ mode: 'pos' })

    // Step 3: Assertions
    expect(response).to.have.status(200)
    expect(response.body).to.deep.equal(responseData)
  })

  it('should return a 200 response when a GET request with mode as "pos" and num_entries=5 is successful', async () => {
    // Step 1: Mock the axios get method to return a successful response
    const responseData = [{
      _id: '6541ee58581af05899ccf7c6',
      date: 'Wed, 01 Nov 2023 06:21:09 GMT',
      tagged_sentence: [['How', 'WRB'], ['John', 'NNP'], ['is', 'VBZ'], ['doing', 'VBG'], ['in', 'IN'], ['Japan', 'NNP'], ['?', '.']]
    }]
    const axiosGetStub = sandbox.stub(axios, 'get')
    axiosGetStub.resolves({ status: 200, data: responseData })

    // Step 2: Perform a simulated GET request
    const response = await chai.request(server)
      .get('/fetch_entries')
      .query({ mode: 'pos', num_entries: 5 })

    // Step 3: Assertions
    expect(response).to.have.status(200)
    expect(response.body).to.deep.equal(responseData)
  })

  it('should return a 200 response when a GET request with mode as "pos" and entry_id is successful', async () => {
    // Step 1: Mock the axios get method to return a successful response
    const responseData = [{
      _id: '6541ee58581af05899ccf7c6',
      date: 'Wed, 01 Nov 2023 06:21:09 GMT',
      tagged_sentence: [['How', 'WRB'], ['John', 'NNP'], ['is', 'VBZ'], ['doing', 'VBG'], ['in', 'IN'], ['Japan', 'NNP'], ['?', '.']]
    }]
    const axiosGetStub = sandbox.stub(axios, 'get')
    axiosGetStub.resolves({ status: 200, data: responseData })

    // Step 2: Perform a simulated GET request
    const response = await chai.request(server)
      .get('/fetch_entries')
      .query({ mode: 'pos', entry_id: '6541ee58581af05899ccf7c5' })

    // Step 3: Assertions
    expect(response).to.have.status(200)
    expect(response.body).to.deep.equal(responseData)
  })

  it('should return a 400 response when a GET request with mode missing', async () => {
    // Step 1: Perform a simulated GET request with mode missing
    const response = await chai.request(server)
      .get('/fetch_entries')

    // Step 2: Assertions
    expect(response).to.have.status(400)
    expect(response.body).to.include({ error: messages.ILLEGAL_OR_MISSING_MODE })
  })

  it('should return a 400 response when a GET request with incorrect mode', async () => {
    // Step 1: Perform a simulated GET request with an incorrect mode
    const response = await chai.request(server)
      .get('/fetch_entries')
      .query({ mode: 'invalid_mode' })

    // Step 2: Assertions
    expect(response).to.have.status(400)
    expect(response.body).to.include({ error: messages.ILLEGAL_OR_MISSING_MODE })
  })

  it('should return a 400 response when a GET request with num_entries as a non-numeric string', async () => {
    // Step 1: Perform a simulated GET request with num_entries as a non-numeric string
    const response = await chai.request(server)
      .get('/fetch_entries')
      .query({ mode: 'pos', num_entries: 'some string' })

    // Step 2: Assertions
    expect(response).to.have.status(400)
    expect(response.body).to.include({ error: messages.NUM_ENTRIES_MUST_BE_INT })
  })

  it('should return a 400 response when a GET request with num_entries as zero', async () => {
    // Step 1: Perform a simulated GET request with num_entries as zero
    const response = await chai.request(server)
      .get('/fetch_entries')
      .query({ mode: 'pos', num_entries: 0 })

    // Step 2: Assertions
    expect(response).to.have.status(400)
    expect(response.body).to.include({ error: messages.NUM_ENTRIES_MUST_BE_POSITIVE })
  })

  it('should return a 400 response when a GET request with num_entries as a negative number', async () => {
    // Step 1: Perform a simulated GET request with num_entries as a negative number
    const response = await chai.request(server)
      .get('/fetch_entries')
      .query({ mode: 'pos', num_entries: -5 })

    // Step 2: Assertions
    expect(response).to.have.status(400)
    expect(response.body).to.include({ error: messages.NUM_ENTRIES_MUST_BE_POSITIVE })
  })

  it('should return a 500 error when the GET call to the dal service encounters "ECONNREFUSED" error', async () => {
    // Step 1: Mock the axios get method to return an "ECONNREFUSED" error
    const axiosGetStub = sandbox.stub(axios, 'get')
    axiosGetStub.rejects({ code: 'ECONNREFUSED' })

    // Step 2: Perform a simulated GET request
    const response = await chai.request(server)
      .get('/fetch_entries')
      .query({ mode: 'pos' })

    // Step 3: Assertions
    expect(response).to.have.status(500)
    expect(response.body).to.include({ error: messages.DAL_SERVICE_UNAVAILABLE })
  })

  it('should return a 500 response when the GET call to the dal service returns a status code of 400 or 500 with an error message', async () => {
    // Step 1: Mock the axios get method to return a 500 response with an error message
    const errorMessage = 'Internal server error in the DAL service'

    const errorResponse = {
      status: 500,
      message: errorMessage
    }
    const axiosGetStub = sandbox.stub(axios, 'get')
    axiosGetStub.rejects(errorResponse)

    // Step 2: Perform a simulated GET request
    const response = await chai.request(server)
      .get('/fetch_entries')
      .query({ mode: 'pos' })

    // Step 3: Assertions
    expect(response).to.have.status(500)
    expect(response.body).to.deep.equal({ error: messages.DAL_SERVICE_ERROR, details: errorMessage })
  })
})
