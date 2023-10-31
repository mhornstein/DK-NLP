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

  before(() => {
    sandbox = sinon.createSandbox(); // To mock the axios instance we will use a sinon sandbox
  });

  after(() => {
    sandbox.restore(); // Restore axios to its original implementation
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
  
});
