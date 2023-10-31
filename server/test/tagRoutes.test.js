const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
chai.use(chaiHttp);

const server = require('../src/server');
const axios = require('../src/util/axiosInstance');
const messages = require('../src/util/messages');

describe('Tagging Route', () => {
  let sandbox;

  beforeEach(() => {
    // To mock the axios instance we will use a sinon sandbox
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    // Restore the sandbox after each test
    sandbox.restore();
  });

  it('should simulate a successful GET request', async () => {
    // Step 1: Mock the axios get and post methods
    const axiosGetStub = sandbox.stub(axios, 'get');
    const axiosPostStub = sandbox.stub(axios, 'post');

    tagged_sentence = [["some","DT"],["sentence","NN"],["to","IN"],["tag","VB"]]

    const axiosGetResponse = {
      status: 200,
      data: { result: tagged_sentence}
    };

    const axiosPostResponse = {
      status: 201,
    };

    axiosGetStub.withArgs(sinon.match(/127\.0\.0\.1:4000/)).resolves(axiosGetResponse);
    axiosPostStub.withArgs(sinon.match(/127\.0\.0\.1:5000/)).resolves(axiosPostResponse);

    // Step 2: Perform a simulated GET request
    const response = await chai.request(server)
      .get('/tag')
      .query({ mode: 'pos', sentence: 'some sentence to tag' });

    // Step 3: Assertions
    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal(tagged_sentence);
  });

  it('should return a 400 error when "mode" parameter is missing', async () => {
    // Step 1: Perform a simulated GET request with missing "mode" parameter
    const response = await chai.request(server)
      .get('/tag')
      .query({ sentence: 'some sentence to tag' }); // Missing "mode" parameter
  
    // Step 2: Assertions
    expect(response).to.have.status(400);
    expect(response.body).to.deep.equal({ error: messages.INVALID_TAG_REQUEST });
  });

  it('should return a 400 error when "sentence" parameter is missing', async () => {
    // Step 1: Perform a simulated GET request with missing "sentence" parameter
    const response = await chai.request(server)
      .get('/tag')
      .query({ mode: 'pos' }); // Missing "sentence" parameter
  
    // Step 2: Assertions
    expect(response).to.have.status(400);
    expect(response.body).to.deep.equal({ error: messages.INVALID_TAG_REQUEST });
  });

  it('should return a 400 error when the GET call to the tag service returns a 400 error code', async () => {
    // Step 1: Mock the axios get method to return a 400 error
    const error_details = 'Some error'
    const axiosGetStub = sandbox.stub(axios, 'get');
    axiosGetStub.rejects({ response: { status: 400, data: { error: error_details } } });
  
    // Step 2: Perform a simulated GET request
    const response = await chai.request(server)
      .get('/tag')
      .query({ mode: 'pos', sentence: 'some sentence to tag' });
  
    // Step 3: Assertions
    expect(response).to.have.status(500);
    expect(response.body).to.deep.equal({error: messages.ERROR_REPORTED_BY_TAGGING_SERVICE, details: error_details});
  });

  it('should return a 500 error when the GET call to the tag service encounters "ECONNREFUSED" error', async () => {
    // Step 1: Mock the axios get method to return an "ECONNREFUSED" error
    const axiosGetStub = sandbox.stub(axios, 'get');
    axiosGetStub.rejects({ code: 'ECONNREFUSED' });
  
    // Step 2: Perform a simulated GET request
    const response = await chai.request(server)
      .get('/tag')
      .query({ mode: 'pos', sentence: 'some sentence to tag' });
  
    // Step 3: Assertions
    expect(response).to.have.status(500);
    expect(response.body).to.include({ error: messages.TAGGING_SERVICE_UNAVAILABLE });
  });
    
});
