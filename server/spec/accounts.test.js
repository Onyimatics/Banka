import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';
import testData from './seeds/users.seeds';

const { expect } = chai;
chai.use(chaihttp);
const {
  client1, staff1, admin1, client2, staff2, admin2,
} = testData;
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
    it('should fetch an account by accountNumber', (done) => {
      chai.request(app)
        .get(`${accountUrl}/9901234567`)
        .set('authorization', staff1)
        .end((err, res) => {
          expect(res.body.status).to.equal(200);
          expect(res.body.message).to.equal('Account details Successfully Retrieved');
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.json;
          expect(res.body.data.accountNumber).to.equal(9901234567);
          done();
        });
    });
    it('should not fetch an account if accountNumber is not available', (done) => {
      chai.request(app)
        .get(`${accountUrl}/75658679085`)
        .set('authorization', staff1)
        .end((err, res) => {
          expect(res.body.status).to.equal(404);
          expect(res.body.message).to.equal('Account not found');
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.json;
          done();
        });
    });
  });
  describe('POST request for creating user account /accounts', () => {
    it('should successfully create an account ', (done) => {
      chai.request(app)
        .post(accountUrl)
        .set('authorization', staff1)
        .send({
          type: 'savings',
          id: 8,
        })
        .end((err, res) => {
          expect(res.body.status).to.equal(201);
          expect(res.body.message).to.equal('Successfully created a new bank account');
          done();
        });
    });
  });
  it('should fail for invalid user account', (done) => {
    chai.request(app)
      .post(accountUrl)
      .set('authorization', admin1)
      .send({
        type: 'savings',
        id: 22,
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(404);
        expect(res.body.message).to.equal('User account not found');
        done();
      });
  });
  it('should not create account for invalid token', (done) => {
    chai.request(app)
      .post(accountUrl)
      // .set('authorization', 'invalidtoken')
      .send({
        type: 'savings',
        id: 7,
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('You are not signed in.');
        done();
      });
  });
  it('should not create account for expired token', (done) => {
    chai.request(app)
      .post(accountUrl)
      .set('authorization', client2)
      .send({
        type: 'savings',
        id: 7,
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('You are not signed in.');
        done();
      });
  });
  it('should not create account if a user does not choose account type', (done) => {
    chai.request(app)
      .post(accountUrl)
      .set('authorization', client1)
      .send({
        id: 7,
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter a valid account type');
        done();
      });
  });
  describe('PATCH requests for activating/deactivating user account', () => {
    it('Should activate/deactivate user account successfully', (done) => {
      chai.request(app)
        .patch('/api/v1/accounts/9801234567')
        .set('authorization', admin1)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal(200);
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Successfully updated an account status');
          done();
        });
    });
    it('Should allow only admin/staff to perform action', (done) => {
      chai.request(app)
        .patch('/api/v1/accounts/9801234567')
        .set('authorization', client1)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal(401);
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Unauthorised');
          done();
        });
    });
    it('should flag an error if the account number does not exist', (done) => {
      chai.request(app)
        .patch('/api/v1/accounts/0009486355262')
        .set('authorization', admin1)
        .send({ status: 'active' })
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal(400);
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('Account not found');
          done();
        });
    });
  });
  describe('DELETE requests for deleting user account', () => {
    it('Should delete user account successfully', (done) => {
      chai.request(app)
        .delete('/api/v1/accounts/9901234567')
        .set('authorization', staff1)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal(200);
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Account successfully deleted');
          done();
        });
    });
    it('Should allow only admin/staff to perform action', (done) => {
      chai.request(app)
        .delete('/api/v1/accounts/9901234567')
        .set('authorization', client1)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal(401);
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Unauthorised');
          done();
        });
    });
    it('Should flag an error is the account number does not exist', (done) => {
      chai.request(app)
        .delete('/api/v1/accounts/0002345678')
        .set('authorization', staff1)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal(400);
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('Account not found');
          done();
        });
    });
  });
});
