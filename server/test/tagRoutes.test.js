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
    sandbox = sinon.createSandbox(); // To mock the axios instance we will use a sinon sandbox
  });

  after(() => {
    sandbox.restore(); // Restore axios to its original implementation
  });

  it('should simulate a successful GET request', async () => {
    
    // Step 1: Mock the axios get and post methods
    const axiosGetStub = sandbox.stub(axios, 'get');
    const axiosPostStub = sandbox.stub(axios, 'post');

    const axiosGetResponse = {
      status: 200,
      data: { result: 'tagged_sentence' },
    };

    const axiosPostResponse = {
      status: 200,
    };


    axiosGetStub.withArgs(sinon.match(/127\.0\.0\.1:4000/)).resolves(axiosGetResponse);
    axiosPostStub.withArgs(sinon.match(/127\.0\.0\.1:5000/)).resolves(axiosPostResponse);

    // Step 2: Perform a simulated GET request
    const response = await chai.request(server)
      .get('/tag')
      .query({ mode: 'ner', sentence: 'testSentence' });

    // Step 3: Assertions
    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal('tagged_sentence');
  });
});
