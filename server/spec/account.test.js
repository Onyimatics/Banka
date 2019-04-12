import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
import accounts from '../model/accounts';

const { expect } = chai;
chai.use(chaihttp);
let currentToken;
let decoded;
let authorization;

describe('POST/accounts', () => {
  const accountUrl = '/api/v1/accounts';
  it('should not create an account for a user without a signin token', (done) => {
    chai.request(app)
      .post(accountUrl)
      .send({
        type: 'savings',
      })
      .end((err, res) => {
        currentToken = res.header.token;
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('You are not signed in.');
        done();
      });
  });
  it('should not create an account for a user that has expired token', (done) => {
    chai.request(app)
      .post(accountUrl)
      .send({
        type: 'savings',
      })
      .end((err, res) => {
        currentToken = res.header.error;
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('You are not signed in.');
        done();
      });
  });
  it('should not create an account for a user that has expired token', (done) => {
    chai.request(app)
      .post(accountUrl)
      .set('authorization', `Bearer ${decoded}`)
      .set('Authorization', `Bearer ${authorization}`)
      .send({
        type: 'savings',
      })
      .end((err, res) => {
        // currentToken = res.header.error;
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('You are not signed in.');
        done();
      });
  });
  // it('should create account for a user', (done) => {
  //   chai.request(app)
  //     .post(accountUrl)
  //     .set('authorization', `Bearer ${currentToken}`)
  //     .send(accounts[0])
  //     .end((err, res) => { 
  //       expect(res.body).to.be.an('object');
  //       expect(res.body.status).to.equal(201);
  //       expect(res.body.message).to.equal('Successfully created a new bank account');
  //       done();
  //     });
  // });
  // it('should not create account if a user does not choose account type', (done) => {
  //   chai.request(app)
  //     .post(accountUrl)
  //     .send(accounts[9])
  //     .end((err, res) => {
  //       expect(res.body.status).to.equal(400);
  //       expect(res.body.message).to.equal('Enter a valid account type');
  //       done();
  //     });
  // });
});
