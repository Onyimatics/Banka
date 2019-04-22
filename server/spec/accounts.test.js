import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaihttp);

describe('POST /api/v1/accounts', () => {
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
      .post('/api/v1/auth/signin')
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
      .post('/api/v1/accounts')
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
      .post('/api/v1/accounts')
      .set('authorization', userToken)
      .send(create, user2)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter a valid account type');
        done();
      });
  });

  it('should not create account if account type is not valid', (done) => {
    const create = {
      type: 'savin',
    };
    chai.request(app)
      .post('/api/v1/accounts')
      .set('authorization', userToken)
      .send(create, user2)
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter a valid account type');
        done();
      });
  });
});

// describe('PATCH /api/v1/accounts', () => {
//   const staff = {
//     email: 'emekaike@gmail.com',
//     password: '123456789',
//   };
//   const admin = {
//     email: 'ezikeonyinyefavour@gmail.com',
//     password: '123456789',
//   };

//   let adminToken;
//   before((done) => {
//     chai.request(app)
//       .post('/api/v1/auth/signin')
//       .send(admin)
//       .end((err, res) => {
//         adminToken = res.body.data.token;
//         done();
//       });
//   });

//   let staffToken;
//   before((done) => {
//     chai.request(app)
//       .post('/api/v1/auth/signin')
//       .send(staff)
//       .end((err, res) => {
//         staffToken = res.body.data.token;
//         done();
//       });
//   });

//   it('should successfully activate or deactivate an account', (done) => {
//     const update = {
//       status: 'active',
//     };
//     chai.request(app)
//       .patch('/api/v1/accounts/9701234568')
//       .set('authorization', staffToken)
//       .send(update)
//       .end((err, res) => {
//         expect(res.body.status).to.equal(200);
//         expect(res.body.message).to.equal('Successfully updated an account status');
//         done();
//       });
//   });

//   it('should allow staff to successfully activate or deactivate an account', (done) => {
//     const update = {
//       status: 'dormant',
//     };
//     chai.request(app)
//       .patch('/api/v1/accounts/9601234578')
//       .set('authorization', adminToken)
//       .send(update)
//       .end((err, res) => {
//         expect(res.body.status).to.equal(200);
//         expect(res.body.message).to.equal('Successfully updated an account status');
//         done();
//       });
//   });


//   it('should not update status if the status is invalid', (done) => {
//     const update = {
//       status: 'flm;dsm',
//     };

//     chai.request(app)
//       .patch('/api/v1/accounts/9701234568')
//       .set('authorization', adminToken)
//       .send(update)
//       .end((err, res) => {
//         expect(res.body.status).to.equal(400);
//         expect(res.body.message).to.equal('Invalid Account status');
//         done();
//       });
//   });

//   it('should not update status if the account is not found', (done) => {
//     const update = {
//       status: 'active',
//     };
//     chai.request(app)
//       .patch('/api/v1/accounts/9701234568565')
//       .set('authorization', adminToken)
//       .send(update)
//       .end((err, res) => {
//         expect(res.body.status).to.equal(400);
//         expect(res.body.message).to.equal('Account not found');
//         done();
//       });
//   });

//   it('should not activate an active account', (done) => {
//     const update = {
//       status: 'active',
//     };
//     chai.request(app)
//       .patch('/api/v1/accounts/9102345678')
//       .set('authorization', adminToken)
//       .send(update)
//       .end((err, res) => {
//         expect(res.status).to.equal(304);
//         // expect(res.message).to.equal('Not Modified');
//         done();
//       });
//   });
// });

// describe('DELETE /api/v1/accounts', () => {
//   const staff = {
//     email: 'emekaike@gmail.com',
//     password: '123456789',
//   };
//   const admin = {
//     email: 'ezikeonyinyefavour@gmail.com',
//     password: '123456789',
//   };

//   let adminToken;
//   before((done) => {
//     chai.request(app)
//       .post('/api/v1/auth/signin')
//       .send(admin)
//       .end((err, res) => {
//         adminToken = res.body.data.token;
//         done();
//       });
//   });

//   let staffToken;
//   before((done) => {
//     chai.request(app)
//       .post('/api/v1/auth/signin')
//       .send(staff)
//       .end((err, res) => {
//         staffToken = res.body.data.token;
//         done();
//       });
//   });


//   it('should successfully delete an account', (done) => {
//     chai.request(app)
//       .delete('/api/v1/accounts/9701234568')
//       .set('authorization', adminToken)
//       // .send(delete)
//       .end((err, res) => {
//         expect(res.body.status).to.equal(200);
//         expect(res.body.message).to.equal('Account successfully deleted');
//         done();
//       });
//   });

//   it('should allow staff to successfully delete an account', (done) => {
//     chai.request(app)
//       .delete('/api/v1/accounts/9601234578')
//       .set('authorization', staffToken)
//       .end((err, res) => {
//         expect(res.body.status).to.equal(200);
//         expect(res.body.message).to.equal('Account successfully deleted');
//         done();
//       });
//   });


//   it('should not update status if Account is not found', (done) => {
//     chai.request(app)
//       .delete('/api/v1/accounts/97012345686686')
//       .set('authorization', adminToken)
//       .end((err, res) => {
//         expect(res.body.status).to.equal(404);
//         expect(res.body.message).to.equal('Account not found');
//         done();
//       });
//   });
// });
