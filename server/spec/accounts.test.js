import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaihttp);
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImlhdCI6MTU1NTc3MDA1M30.6J7Lmugkww_bSoqKArodoQM4su96QtUrhxA500OxEpg';
describe('POST /api/v2/accounts', () => {
  const user = {
    email: 'johndumelo@gmail.com',
    password: '123456789',
  };
  const user2 = {
    email: 'eberechebere@gmail.com',
    password: '123456789',
  };

  let userToken;
  before((done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send(user)
      .end((err, res) => {
        userToken = res.body.data.token;
        done();
      });
  });


  it('should successfully create an account', (done) => {
    const create = {
      type: 'savings',
      openingBalance: '1000.00',
    };
    chai.request(app)
      .post('/api/v2/accounts')
      .set('authorization', userToken)
      .send(create)
      .end((err, res) => {
        expect(res.body.status).to.equal(201);
        expect(res.body.message).to.equal('Successfully created a new bank account');
        done();
      });
  });

  it('should not create account if account type is not specified', (done) => {
    const create = {
      type: '',
    };
    chai.request(app)
      .post('/api/v2/accounts')
      .set('authorization', userToken)
      .send(create, user2)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter a valid account type');
        done();
      });
  });

  it('should not create account for an invalid token', (done) => {
    const create = {
      type: 'savings',
    };
    chai.request(app)
      .post('/api/v2/accounts')
      .set('authorization', invalidToken)
      .send(create, user2)
      .end((err, res) => {
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('You are not signed in.');
        done();
      });
  });


  it('should not create account if account type is not valid', (done) => {
    const create = {
      type: 'savin',
    };
    chai.request(app)
      .post('/api/v2/accounts')
      .set('authorization', userToken)
      .send(create, user2)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter a valid account type');
        done();
      });
  });
});

describe('PATCH /api/v2/accounts', () => {
  const staff = {
    email: 'emekaike@gmail.com',
    password: '123456789',
  };
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

  it('should successfully activate or deactivate an account', (done) => {
    chai.request(app)
      .patch('/api/v2/accounts/1102345679')
      .set('authorization', adminToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.message).to.equal('Account successfully activated');
        done();
      });
  });

  it('should allow staff to successfully activate or deactivate an account', (done) => {
    chai.request(app)
      .patch('/api/v2/accounts/1102345679')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.message).to.equal('Account successfully deactivated');
        done();
      });
  });

  it('should not update status if the account is not found', (done) => {
    chai.request(app)
      .patch('/api/v2/accounts/9701234568565')
      .set('authorization', adminToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(404);
        expect(res.body.message).to.equal('Account Not Found');
        done();
      });
  });
});

describe('DELETE /api/v2/accounts', () => {
  const staff = {
    email: 'emekaike@gmail.com',
    password: '123456789',
  };
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


  it('should successfully delete an account', (done) => {
    chai.request(app)
      .delete('/api/v2/accounts/1102345687')
      .set('authorization', adminToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.message).to.equal('Account successfully deleted');
        done();
      });
  });

  it('should allow staff to successfully delete an account', (done) => {
    chai.request(app)
      .delete('/api/v2/accounts/1102345679')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.message).to.equal('Account successfully deleted');
        done();
      });
  });


  it('should not update status if Account is not found', (done) => {
    chai.request(app)
      .delete('/api/v2/accounts/97012345686686')
      .set('authorization', adminToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(404);
        expect(res.body.message).to.equal('Account Not Found');
        done();
      });
  });
});

describe('GET /api/v2/accounts/<account-number>/transactions', () => {
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


  it('should successfully view an account transaction history', (done) => {
    chai.request(app)
      .get('/api/v2/accounts/1102345678/transactions')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.data).to.not.equal(null);
        expect(res.body.message).to.equal('Transactions Successfully Retrieved');
        done();
      });
  });

  it('should flag an error if the account number does not exist', (done) => {
    chai.request(app)
      .get('/api/v2/accounts/1102345678008989/transactions')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.message).to.equal('Account Not Found');
        expect(res.statusCode).to.equal(404);
        done();
      });
  });

  it('should flag an error if the account number is invalid', (done) => {
    chai.request(app)
      .get('/api/v2/accounts/11fbkfur4/transactions')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.message).to.equal('Enter a valid Account Number');
        expect(res.statusCode).to.equal(400);
        done();
      });
  });
});

describe('GET /api/v2/user/<user-email>/accounts', () => {
  const staff = {
    email: 'emekaike@gmail.com',
    password: '123456789',
  };

  const user = {
    email: 'markzuckerberg@gmail.com',
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

  let userToken;
  before((done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send(user)
      .end((err, res) => {
        userToken = res.body.data.token;
        done();
      });
  });


  it('should successfully get all accounts owned by a specific user', (done) => {
    chai.request(app)
      .get('/api/v2/user/markzuckerberg@gmail.com/accounts')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.data).to.not.equal(null);
        expect(res.body.message).to.equal('All User Accounts Successfully Retrieved');
        done();
      });
  });

  it('should flag an error if the email is incorrect', (done) => {
    chai.request(app)
      .get('/api/v2/user/olusholaoderigmail.com/accounts')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.message).to.equal('Enter a valid email.');
        expect(res.statusCode).to.equal(400);
        done();
      });
  });

  it('should flag an error if the email does not belong to the user', (done) => {
    chai.request(app)
      .get('/api/v2/user/femiotedola@gmail.com/accounts')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body.message).to.equal('Accounts Not Found');
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});

describe('GET api/v2/accounts/:accountNumber', () => {
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


  it('should successfully get a specific account details', (done) => {
    chai.request(app)
      .get('/api/v2/accounts/1102345678')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.data).to.not.equal(null);
        expect(res.body.message).to.equal('Account Details Successfully Retrieved');
        done();
      });
  });

  it('should flag an error if the account does not exist', (done) => {
    chai.request(app)
      .get('/api/v2/accounts/2102345678788')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.message).to.equal('Account Not Found');
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('should flag an error if the account number is invalid', (done) => {
    chai.request(app)
      .get('/api/v2/accounts/2102345678rhifu')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.message).to.equal('Enter a valid Account Number');
        expect(res.status).to.equal(400);
        done();
      });
  });
});

describe('GET api/v2/accounts', () => {
  const staff = {
    email: 'emekaike@gmail.com',
    password: '123456789',
  };
  const user = {
    email: 'markzuckerberg@gmail.com',
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

  let userToken;
  before((done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send(user)
      .end((err, res) => {
        userToken = res.body.data.token;
        done();
      });
  });


  it('should successfully get a list of all bank accounts', (done) => {
    chai.request(app)
      .get('/api/v2/accounts')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.data).to.not.equal(null);
        expect(res.body.message).to.equal('All Bank Accounts Successfully Retrieved');
        done();
      });
  });

  it('should not allow a client to get a list of all bank accounts', (done) => {
    chai.request(app)
      .get('/api/v2/accounts')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body.message).to.equal('Unauthorized');
        expect(res.status).to.equal(401);
        done();
      });
  });
});

describe('GET api/v2/accounts?status=active', () => {
  const staff = {
    email: 'emekaike@gmail.com',
    password: '123456789',
  };
  const user = {
    email: 'markzuckerberg@gmail.com',
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

  let userToken;
  before((done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send(user)
      .end((err, res) => {
        userToken = res.body.data.token;
        done();
      });
  });


  it('should successfully get a list of all active bank accounts', (done) => {
    chai.request(app)
      .get('/api/v2/accounts?status=active')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.data).to.not.equal(null);
        expect(res.body.data[0].status).to.equal('active');
        done();
      });
  });

  it('should not allow a client to get a list of all active bank accounts', (done) => {
    chai.request(app)
      .get('/api/v2/accounts?status=active')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('Unauthorized');
        done();
      });
  });
});

describe('GET api/v2/accounts?status=dormant', () => {
  const staff = {
    email: 'emekaike@gmail.com',
    password: '123456789',
  };
  const user = {
    email: 'markzuckerberg@gmail.com',
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

  let userToken;
  before((done) => {
    chai.request(app)
      .post('/api/v2/auth/signin')
      .send(user)
      .end((err, res) => {
        userToken = res.body.data.token;
        done();
      });
  });


  it('should successfully get a list of all dormant bank accounts', (done) => {
    chai.request(app)
      .get('/api/v2/accounts?status=dormant')
      .set('authorization', staffToken)
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        expect(res.body.data).to.not.equal(null);
        expect(res.body.data[0].status).to.equal('dormant');
        done();
      });
  });

  it('should not allow a client to get a list of all dormant bank accounts', (done) => {
    chai.request(app)
      .get('/api/v2/accounts?status=dormant')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('Unauthorized');
        done();
      });
  });
});
