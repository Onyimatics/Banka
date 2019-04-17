import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
import testData from './seeds/users.seeds';

const { expect } = chai;
chai.use(chaihttp);
const {
  client1, staff1, admin1,
} = testData;
const transactionUrl = '/api/v1/transactions/';

describe('All Test Report for Banka App', () => {
  describe('GET requests for fetching transaction/transactions', () => {
    it('Should fetch all transactions successfully', (done) => {
      chai.request(app)
        .get(transactionUrl)
        .set('authorization', admin1)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal(200);
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('All Transactions fetched Successfully');
          done();
        });
    });
    it('should fetch a transacton by tranaction Id', (done) => {
      chai.request(app)
        .get(`${transactionUrl}/2`)
        .set('authorization', staff1)
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          expect(res.body.message).to.equal('Transaction details Successfully Retrieved');
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.json;
          expect(res.body.data.id).to.equal(2);
          done();
        });
    });
    it('should not fetch a transaction if transaction does not exist', (done) => {
      chai.request(app)
        .get(`${transactionUrl}/45`)
        .set('authorization', client1)
        .end((err, res) => {
          expect(res.body.status).to.equal(404);
          expect(res.body.message).to.equal('Transaction not found');
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.json;
          done();
        });
    });
  });
  describe('POST/transactions/:accountnumber/debit and credit', () => {
    // it('should debit a user account', (done) => {
    //   chai.request(app)
    //     .post('/api/v1/transactions/9601234578/debit')
    //     .send({ amount: 30000 })
    //     .set('authorization', staff1)
    //     .end((err, res) => {
    //       expect(res.body.message).to.equal('Account has been successfully debited');
    //       expect(res).to.have.status(200);
    //       expect(res.body).to.be.an('object');
    //       // eslint-disable-next-line no-unused-expressions
    //       expect(res).to.be.json;
    //       done();
    //     });
    // });

    it('should credit a user account', (done) => {
      chai.request(app)
        .post('/api/v1/transactions/9601234578/credit')
        .send({ amount: 30000 })
        .set('authorization', staff1)
        .end((err, res) => {
          expect(res.body.message).to.equal('Account has been successfully credited');
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.json;
          done();
        });
    });

    it('should allow only staff to perform action', (done) => {
      chai.request(app)
        .post('/api/v1/transactions/9901234567/debit')
        .set('authorization', admin1)
        .send({ amount: 30000 })
        .end((err, res) => {
          expect(res.body.message).to.equal('Unauthorized');
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.json;
          done();
        });
    });
    it('should flag an error if the account balance to be debited is inactive', (done) => {
      chai.request(app)
        .post('/api/v1/transactions/9801234567/debit')
        .set('authorization', staff1)
        .send({ status: 'draft' })
        .end((err, res) => {
          expect(res.body.message).to.equal('Account is currently inactive');
          expect(res.body.status).to.equal(400);
          done();
        });
    });

    // it('should flag an error if the account balance to be debited is insufficient', (done) => {
    //   chai.request(app)
    //     .post('/api/v1/transactions/9301245678/debit')
    //     .set('authorization', staff1)
    //     .send({
    //       Balance: 0,
    //       status: 'active',
    //     })
    //     .end((err, res) => {
    //       expect(res.body.message).to.equal('Insufficient fund');
    //       expect(res.body.status).to.equal(400);
    //       done();
    //     });
    // });
  });
});
