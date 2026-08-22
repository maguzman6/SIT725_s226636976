const expect = require('chai').expect;
const { getLuckyNumber } = require('../services/luckyService');

describe('Calculation of Lucky Number', () => {
    // 1. Valid behavior
    it('should return a lucky number based on the input number', (done) => {
        const favNumber = 7;
        const result = getLuckyNumber(favNumber);
        expect(result).to.be.a('number');
        expect(result).to.equal(56); // 7^2 + 7 = 56
        done();
    });

    // 2. Edge cases
    it('should return 7 when input is zero', (done) => {
        const result = getLuckyNumber(0);
        expect(result).to.be.a('number');
        expect(result).to.equal(7); // 0^2 + 7 = 7
        done();
    });

    it('should correctly calculate lucky number for negative numbers', (done) => {
        const result = getLuckyNumber(-4);
        expect(result).to.be.a('number');
        expect(result).to.equal(23); // (-4)^2 + 7 = 23
        done();
    });

    it('should correctly calculate lucky number for floating point decimals', (done) => {
        const result = getLuckyNumber(2.5);
        expect(result).to.be.a('number');
        expect(result).to.equal(13.25); // 2.5^2 + 7 = 13.25
        done();
    });

});