/* global describe it */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const fs = require('fs');

chai.should();
chai.use(chaiHttp);

/*
function dumpRes(res) {
    fs.writeFile('./test/dump.txt', JSON.stringify(res), err => {
        if (err) {
        console.error(err);
        }
    });
}
*/

// Test basic routes
describe('Basic Routes', () => {
    // Start
    describe('GET /', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");

                });
            done();
        });
    });

    // Codes
    describe('GET /codes', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/codes")
                .end((err, res) => {
                    // Status code
                    res.should.have.status(200);

                    // Body
                    res.body.should.be.an("object");

                    // Data
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);

                });
            done();
        });
    });

    // Delayed
    describe('GET /delayed', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/delayed")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                    
                });
            done();
        });
    });

    // Tickets
    describe('GET /tickets', () => {
        it('200 HAPPY PATH', (done) => {
            chai.request(server)
                .get("/tickets")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.above(0);
                });
            done();
        });
    });
});