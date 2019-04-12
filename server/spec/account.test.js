import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
// import accounts from '../model/accounts';
import testData from './seeds/users.seeds';

const { expect } = chai;
chai.use(chaihttp);
const { client1, staff1, admin1 } = testData;
const accountUrl = '/api/v1/accounts';

describe('All Test Report for Banka App', () => {
  describe('GET requests for fetching user account /accounts', () => {
    it('Should fetch all bank accounts successfully', (done) => {
      chai.request(app)
        .get(accountUrl)
        .set('authorization', admin1)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal(200);
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('All Accounts fetched Successfully');
          done();
        });
    });
    // it('should fetch an account', (done) => {
    //   chai.request(app)
    //     .get(`${accountUrl}/9901234567`)
    //     .set('authorization', staff1)
    //     .end((err, res) => {
    //       expect(res.body.status).to.equal(200);
    //       expect(res.body.message).to.equal('Account details Successfully Retrieved');
    //       expect(res).to.have.status(200);
    //       expect(res.body).to.be.an('object');
    //       // eslint-disable-next-line no-unused-expressions
    //       expect(res).to.be.json;
    //       expect(res.body.data.accountNumber).to.equal(9901234567);
    //       done();
    //     });
    // });
    it('should successfully create an account ', (done) => {
      chai.request(app)
        .post(accountUrl)
        .set('authorization', staff1)
        .send({
          type: 'savings',
          id: 8,
        })
        .end((err, res) => {
        // currentToken = res.header.error;
          expect(res.body.status).to.equal(201);
          expect(res.body.message).to.equal('Successfully created a new bank account');
          done();
        });
    });
    // it('should fail for invalid user account', (done) => {
    //   chai.request(app)
    //     .post(accountUrl)
    //     .set('authorization', admin1)
    //     .send({
    //       type: 'savings',
    //       id: 22,
    //     })
    //     .end((err, res) => {
    //       expect(res.body).to.be.an('object');
    //       expect(res.body.status).to.equal(404);
    //       expect(res.body.message).to.equal('User account not found');
    //       done();
    //     });
    // });
    // it('should not create account if a user does not choose account type', (done) => {
    //   chai.request(app)
    //     .post(accountUrl)
    //     .set('authorization', 'invalidtoken')
    //     .send({
    //       type: 'savings',
    //       id: 7,
    //     })
    //     .end((err, res) => {
    //       expect(res.body.status).to.equal(401);
    //       expect(res.body.message).to.equal('You need to login.');
    //       done();
    //     });
    // });
  });
});
