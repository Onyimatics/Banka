import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';


const { expect } = chai;
chai.use(chaihttp);
describe('POST /api/v2/transactions/:accountNumber/debit', () => {
  const staff = {
    email: 'emekaike@gmail.com',
    password: '123456789',
  };

  let staffToken;
  before((done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send(staff)
      .end((err, res) => {
        staffToken = res.body.data.token;
        done();
      });
  });


  it('should successfully debit an account', (done) => {
    const debit = {
      amount: '10000',
    };
    chai.request(app)
      .post('/api/v2/transactions/1102345678/debit')
      .set('authorization', staffToken)
      .send(debit)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.message).to.equal('Account has been successfully debited');
        done();
      });
  });

  it('should not debit an account if account does not exist', (done) => {
    const debitss = {
      amount: '10000',
    };
    chai.request(app)
      .post('/api/v2/transactions/94012356783376483/debit')
      .set('authorization', staffToken)
      .send(debitss)
      .end((err, res) => {
        expect(res.body.status).to.equal(404);
        expect(res.body.message).to.equal('Account Not Found');
        done();
      });
  });

  it('should not debit an account if account does not exist', (done) => {
    const debitss = {
      amount: '10000',
    };
    chai.request(app)
      .post('/api/v2/transactions/1102345700/debit')
      .set('authorization', staffToken)
      .send(debitss)
      .end((err, res) => {
        expect(res.body.status).to.equal(404);
        expect(res.body.message).to.equal('Account Not Found');
        done();
      });
  });

  it('should not debit an account if account balance is insufficient', (done) => {
    const debitss = {
      amount: '150000',
    };
    chai.request(app)
      .post('/api/v2/transactions/1102345678/debit')
      .set('authorization', staffToken)
      .send(debitss)
      .end((err, res) => {
        expect(res.body.status).to.equal(403);
        expect(res.body.message).to.equal('Insufficient fund');
        done();
      });
  });

  it('should not debit an account if account status is dormant', (done) => {
    const debitss = {
      amount: '10000',
    };
    chai.request(app)
      .post('/api/v2/transactions/1102345677/debit')
      .set('authorization', staffToken)
      .send(debitss)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Account is currently dormant');
        done();
      });
  });
});

const admin = {
  email: 'ezikeonyinyefavour@gmail.com',
  password: '123456789',
};

let adminToken;
before((done) => {
  chai.request(app)
    .post('/api/v2/auth/signin')
    .send(admin)
    .end((err, res) => {
      adminToken = res.body.data.token;
      done();
    });
});

it('should not allow an admin to debit an account', (done) => {
  const debitss = {
    amount: '10000',
  };
  chai.request(app)
    .post('/api/v2/transactions/1102345678/debit')
    .set('authorization', adminToken)
    .send(debitss)
    .end((err, res) => {
      expect(res.body.status).to.equal(401);
      expect(res.body.message).to.equal('Unauthorized');
      done();
    });
});

describe('POST /api/v2/transactions/:accountNumber/credit', () => {
  const staff = {
    email: 'emekaike@gmail.com',
    password: '123456789',
  };

  let staffToken;
  before((done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send(staff)
      .end((err, res) => {
        staffToken = res.body.data.token;
        done();
      });
  });

  it('should successfully credit an account', (done) => {
    const debit = {
      amount: '10000',
    };
    chai.request(app)
      .post('/api/v2/transactions/1102345678/credit')
      .set('authorization', staffToken)
      .send(debit)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.message).to.equal('Account has been successfully credited');
        done();
      });
  });

  it('should not credit an account if account status is dormant', (done) => {
    const debitss = {
      amount: '10000',
    };
    chai.request(app)
      .post('/api/v2/transactions/1102345677/credit')
      .set('authorization', staffToken)
      .send(debitss)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Account is currently dormant');
        done();
      });
  });
});

describe('GET /api/v2/transactions/:id>', () => {
  const staff = {
    email: 'emekaike@gmail.com',
    password: '123456789',
  };

  let staffToken;
  before((done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send(staff)
      .end((err, res) => {
        staffToken = res.body.data.token;
        done();
      });
  });

  it('should successfully get a specific transaction', (done) => {
    chai.request(app)
      .get('/api/v2/transactions/1')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.data).to.not.equal(null);
        expect(res.body.message).to.equal('Transaction Details Successfully Retrieved');
        done();
      });
  });

  it('should flag an error for an incorrectly typed id', (done) => {
    chai.request(app)
      .get('/api/v2/transactions/ter')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid id, id must be a number');
        done();
      });
  });
});
