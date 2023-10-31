const { expect } = require('chai');

describe('add', function() {
  it('should add two numbers correctly', function() {
    const num1 = 5;
    const num2 = 3;
    
    const result = num1 + num2;

    expect(result).to.equal(8);
  });
});
