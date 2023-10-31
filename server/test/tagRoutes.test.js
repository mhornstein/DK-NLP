const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
chai.use(chaiHttp);

const server = require('../src/server');
const axios = require('../src/util/axiosInstance');

describe('Tagging Route', () => {
  let sandbox;

  before(() => {
    // Mock the axios.get function to return a sample response
    // Create a sinon sandbox
    sandbox = sinon.createSandbox();

    // Mock the axios get and post methods
    const axiosGetStub = sandbox.stub(axios, 'get');
    const axiosPostStub = sandbox.stub(axios, 'post');

    // Define the data to be returned by the mocked axios methods
    const axiosGetResponse = {
      status: 200,
      data: { result: 'tagged_sentence' },
    };

    const axiosPostResponse = {
      status: 200,
    };

    // Set up stubs to return the mocked responses
    axiosGetStub.withArgs(sinon.match(/127\.0\.0\.1:4000/)).resolves(axiosGetResponse);
    axiosPostStub.withArgs(sinon.match(/127\.0\.0\.1:5000/)).resolves(axiosPostResponse);
  });

  after(() => {
    // Restore axios.get to its original implementation
    sandbox.restore();
  });

  it('should simulate a successful GET request', async () => {
    // Perform a simulated GET request
    const response = await chai.request(server)
      .get('/tag')
      .query({ mode: 'ner', sentence: 'testSentence' });

    // Assertions
    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal('tagged_sentence');
  });
});
