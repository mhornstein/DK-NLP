const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

const server = require('../src/server');
const axios = require('../src/util/axiosInstance');
const messages = require('../src/util/messages');

describe('Fetch Entries Route', () => {
  let sandbox;

  beforeEach(() => {
    // To mock the axios instance we will use a sinon sandbox
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    // Restore the sandbox after each test
    sandbox.restore();
  });

  it('should return a 200 response when a GET request with mode as "pos" is successful', async () => {
    // Step 1: Mock the axios get method to return a successful response
    const responseData = [{
      _id: '6541ee58581af05899ccf7c6',
      date: 'Wed, 01 Nov 2023 06:21:09 GMT',
      tagged_sentence: [['How', 'WRB'], ['John', 'NNP'], ['is', 'VBZ'], ['doing', 'VBG'], ['in', 'IN'], ['Japan', 'NNP'], ['?', '.']],
    }];
    const axiosGetStub = sandbox.stub(axios, 'get');
    axiosGetStub.resolves({ status: 200, data: responseData });
  
    // Step 2: Perform a simulated GET request
    const response = await chai.request(server)
      .get('/fetch_entries')
      .query({ mode: 'pos' });
  
    // Step 3: Assertions
    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal(responseData);
  });

  it('should return a 200 response when a GET request with mode as "pos" and num_entries=5 is successful', async () => {
    // Step 1: Mock the axios get method to return a successful response
    const responseData = [{
      _id: '6541ee58581af05899ccf7c6',
      date: 'Wed, 01 Nov 2023 06:21:09 GMT',
      tagged_sentence: [['How', 'WRB'], ['John', 'NNP'], ['is', 'VBZ'], ['doing', 'VBG'], ['in', 'IN'], ['Japan', 'NNP'], ['?', '.']],
    }];
    const axiosGetStub = sandbox.stub(axios, 'get');
    axiosGetStub.resolves({ status: 200, data: responseData });
  
    // Step 2: Perform a simulated GET request
    const response = await chai.request(server)
      .get('/fetch_entries')
      .query({ mode: 'pos', num_entries: 5 });
  
    // Step 3: Assertions
    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal(responseData);
  });

  it('should return a 200 response when a GET request with mode as "pos" and entry_id is successful', async () => {
    // Step 1: Mock the axios get method to return a successful response
    const responseData = [{
      _id: '6541ee58581af05899ccf7c6',
      date: 'Wed, 01 Nov 2023 06:21:09 GMT',
      tagged_sentence: [['How', 'WRB'], ['John', 'NNP'], ['is', 'VBZ'], ['doing', 'VBG'], ['in', 'IN'], ['Japan', 'NNP'], ['?', '.']],
    }];
    const axiosGetStub = sandbox.stub(axios, 'get');
    axiosGetStub.resolves({ status: 200, data: responseData });
  
    // Step 2: Perform a simulated GET request
    const response = await chai.request(server)
      .get('/fetch_entries')
      .query({ mode: 'pos', entry_id: '6541ee58581af05899ccf7c5' });
  
    // Step 3: Assertions
    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal(responseData);
  });

  it('should return a 500 error when the GET call to the dal service encounters "ECONNREFUSED" error', async () => {
    // Step 1: Mock the axios get method to return an "ECONNREFUSED" error
    const axiosGetStub = sandbox.stub(axios, 'get');
    axiosGetStub.rejects({ code: 'ECONNREFUSED' });
  
    // Step 2: Perform a simulated GET request
    const response = await chai.request(server)
      .get('/fetch_entries')
      .query({ mode: 'pos' });
  
    // Step 3: Assertions
    expect(response).to.have.status(500);
    expect(response.body).to.include({ error: messages.DAL_SERVICE_UNAVAILABLE });
  });
});