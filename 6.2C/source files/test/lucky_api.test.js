const expect = require('chai').expect;
const request = require('request');

describe('Lucky Number API', () => {
    const baseUrl = 'http://localhost:3000';

    // 1. Valid behavior
    it('should return a lucky number based on the input number - API Call', (done) => {
        const favNumber = 7;
        request.get(`${baseUrl}/api/lucky?number=${favNumber}`, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            const data = JSON.parse(body);
            expect(data).to.have.property('data');
            expect(data.data).to.have.property('luckyNumber', 56);
            expect(data).to.have.property('message', 'Lucky number retrieved');
            done();
        });
    });

    // 2. Edge case (zero)
    it('should calculate lucky number correctly when number is 0', (done) => {
        request.get(`${baseUrl}/api/lucky?number=0`, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            const data = JSON.parse(body);
            expect(data.data.luckyNumber).to.equal(7);
            done();
        });
    });

    // 3. Edge case (negative number)
    it('should calculate lucky number correctly when number is negative', (done) => {
        request.get(`${baseUrl}/api/lucky?number=-4`, (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            const data = JSON.parse(body);
            expect(data.data.luckyNumber).to.equal(23);
            done();
        });
    });

    // 4. Invalid input (non-numeric string)
    it('should return status 400 when non-numeric input is provided', (done) => {
        request.get(`${baseUrl}/api/lucky?number=abc`, (error, response, body) => {
            expect(response.statusCode).to.equal(400);
            const data = JSON.parse(body);
            expect(data.message).to.include('Invalid input');
            expect(data.data).to.be.null;
            done();
        });
    });

    // 5. Invalid input (missing parameter)
    it('should return status 400 when number parameter is missing', (done) => {
        request.get(`${baseUrl}/api/lucky`, (error, response, body) => {
            expect(response.statusCode).to.equal(400);
            const data = JSON.parse(body);
            expect(data.message).to.include('Invalid input');
            done();
        });
    });
});