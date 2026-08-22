const expect = require('chai').expect;
const request = require('request');

describe('Books API Endpoints', () => {
    const baseUrl = 'http://localhost:3000';

    // 1. Get All Books endpoint testing
    describe('GET /api/books - Retrieve all books', () => {

        it('should return status 200 and a list of all books', (done) => {
            request.get(`${baseUrl}/api/books`, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                const resData = JSON.parse(body);
                expect(resData).to.have.property('message', 'Books retrieved using service');
                expect(resData).to.have.property('data');
                expect(resData.data).to.be.an('array');
                expect(resData.data.length).to.be.greaterThan(0);

                // Validate structure of a book object
                const firstBook = resData.data[0];
                expect(firstBook).to.have.property('id');
                expect(firstBook).to.have.property('title');
                expect(firstBook).to.have.property('author');
                expect(firstBook).to.have.property('year');
                expect(firstBook).to.have.property('genre');
                expect(firstBook).to.have.property('summary');
                done();
            });
        });
    });

    // 2. Get Book by ID endpoint testing
    describe('GET /api/books/:id - Retrieve single book by ID', () => {
        it('should return status 200 and the matching book for a valid ID', (done) => {
            const bookId = 'b1';
            request.get(`${baseUrl}/api/books/${bookId}`, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                const resData = JSON.parse(body);
                expect(resData).to.have.property('message', 'Book retrieved using ID service');
                expect(resData.data).to.be.an('array');
                expect(resData.data.length).to.equal(1);
                expect(resData.data[0]).to.have.property('id', 'b1');
                expect(resData.data[0]).to.have.property('title', 'The Three-Body Problem');
                expect(resData.data[0]).to.have.property('author', 'Liu Cixin');
                done();
            });
        });

        it('should return status 404 for a non-existent book ID', (done) => {
            const nonExistentId = 'b999';
            request.get(`${baseUrl}/api/books/${nonExistentId}`, (error, response, body) => {
                expect(response.statusCode).to.equal(404);
                const resData = JSON.parse(body);
                expect(resData).to.have.property('message', 'Book not found');
                expect(resData.data).to.be.an('array').that.is.empty;
                done();
            });
        });
    });
});
