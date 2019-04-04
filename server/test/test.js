import chai from 'chai';
import chaihttp from 'chai-http';
import app from './../app';

const { expect } = chai;
chai.use(chaihttp);

describe('Banka tests', () => {
    describe('Display welcome message', () => {
        it('should display welcome message on start', (done) => {
        chai.request(app)
        .get('/api/v1/')
        .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });
});
});

// import chai from 'chai'
// Import chaihttp from 'chai-http'
// Import app from '../app'

// Const { expect } = chai
// chai.use(chaihttp);

// describe('Banka tests',  () => {

// describe('Display welcome message',  () => {
// it('should display welcome message on start',  (done)  => {
//  chai.request(app)
// .get('/api/v1/')
// .end((err,  res)  => {
// expect(res.statusCode).to.equal(200);
// done();
// });
// });
// });
// });