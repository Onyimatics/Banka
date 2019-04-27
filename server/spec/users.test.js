import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';


const { expect } = chai;
chai.use(chaihttp);
const signupUrl = '/api/v2/auth/signup';

describe('POST/auth signup', () => {
  it('should signup a non existing user(client)', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send({
        firstName: 'Blessing',
        lastName: 'Onwughara',
        email: 'bgirlohara@gmail.com',
        password: 'Blessing',
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res).to.have.status(201);
        expect(res.body.status).to.equal(201);
        expect(res.body.message).to.equal('Successfully created a new user account');
        expect(res.body.data).to.be.a('object');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('firstName');
        expect(res.body.data).to.have.property('lastName');
        expect(res.body.data).to.have.property('email');
        expect(res.body.data.token).to.be.a('string');
        expect(res.body.data.email).to.equal('bgirlohara@gmail.com');
        done();
      });
  });
  it('should not signup a registered user', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send({
        firstName: 'Onyinye',
        lastName: 'Ezike',
        email: 'ezikeonyinyefavour@gmail.com',
        password: '123456789',
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(409);
        expect(res.body.message).to.equal('Email already in use');
        done();
      });
  });
  it('should not signup a user when the email is missing', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send({
        firstName: 'Abraham',
        lastName: 'Ibrahim',
        password: 'Abraham',
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter a valid email.');
        done();
      });
  });
  it('should not signup a user when firstName is missing', (done) => {
    const user = {
      firstName: '',
      lastName: 'Faith',
      email: 'ossaifaith@gmail.com',
      password: 'ossaifaith',
    };
    chai.request(app)
      .post(signupUrl)
      .send(user)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter a valid firstName.');
        done();
      });
  });
  it('should not signup a user when lastName is missing', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send({
        firstName: 'Lilian',
        lastName: '',
        email: 'hayjay@gmail.com',
        password: 'ajirioghene',
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter a valid lastName.');
        done();
      });
  });
  it('should not signup a user when the password is missing', (done) => {
    chai.request(app)
      .post(signupUrl)
      .send({
        firstName: 'Amaka',
        lastName: 'Ezike',
        email: 'amakaezike@gmail.com',
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter a password with at least 8 characters.');
        done();
      });
  });
});

describe('POST/auth signup/admin', () => {
  const admin = {
    email: 'ezikeonyinyefavour@gmail.com',
    password: '123456789',
  };

  const staff = {
    email: 'emekaike@gmail.com',
    password: '123456789',
  };

  const user = {
    email: 'johndumelo@gmail.com',
    password: '123456789',
  };

  let adminToken;
  before((done) => {
    chai.request(app)
      .post('/api/v2/auth/signin/')
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

  it('should signup a new admin or staff', (done) => {
    const one = {
      firstName: 'Ajibola',
      lastName: 'Hussain',
      email: 'ajibolahussain@gmail.com',
      password: 'Ajibolahussain',
      isAdmin: 'false',
    };
    chai.request(app)
      .post('/api/v2/auth/signup/admin')
      .set('authorization', adminToken)
      .send(one)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res).to.have.status(201);
        expect(res.body.status).to.equal(201);
        expect(res.body.message).to.equal('Successfully created a new account for Admin or Staff');
        done();
      });
  });
  it('should not signup a registered user', (done) => {
    const two = {
      firstName: 'Onyinye',
      lastName: 'Ezike',
      email: 'ezikeonyinyefavour@gmail.com',
      password: '123456789',
      isAdmin: 'true',
    };
    chai.request(app)
      .post('/api/v2/auth/signup/admin')
      .set('authorization', adminToken)
      .send(two)
      .end((err, res) => {
        expect(res.body.status).to.equal(409);
        expect(res.body.message).to.equal('Email already in use');
        done();
      });
  });

  it('should not allow a client to signup a new Admin/Staff', (done) => {
    const three = {
      firstName: 'Jeremiah',
      lastName: 'Okorocha',
      email: 'jeremiahokorocha@gmail.com',
      password: '123456789',
      isAdmin: 'true',
    };
    chai.request(app)
      .post('/api/v2/auth/signup/admin')
      .set('authorization', userToken)
      .send(three)
      .end((err, res) => {
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('Unauthorized');
        done();
      });
  });

  it('should not allow a staff to signup a new Admin/Staff', (done) => {
    const four = {
      firstName: 'Michael',
      lastName: 'Sccofield',
      email: 'michaelscoffield@gmail.com',
      password: '123456789',
      isAdmin: 'true',
    };
    chai.request(app)
      .post('/api/v2/auth/signup/admin')
      .set('authorization', staffToken)
      .send(four)
      .end((err, res) => {
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('Unauthorized');
        done();
      });
  });

  it('should not signup Admin/Staff when the email is missing', (done) => {
    const five = {
      firstName: 'Abraham',
      lastName: 'Ibrahim',
      password: 'Abraham',
      isAdmin: 'true',
    };
    chai.request(app)
      .post('/api/v2/auth/signup/admin')
      .set('authorization', adminToken)
      .send(five)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter a valid email.');
        done();
      });
  });
  it('should not signup Admin/Staff when firstName is missing', (done) => {
    const six = {
      firstName: '',
      lastName: 'Faith',
      email: 'ossaifaith@gmail.com',
      password: 'ossaifaith',
      isAdmin: 'false',
    };
    chai.request(app)
      .post('/api/v2/auth/signup/admin')
      .set('authorization', adminToken)
      .send(six)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter a valid firstName.');
        done();
      });
  });
  it('should not signup Admin/Staff when lastName is missing', (done) => {
    const seven = {
      firstName: 'Lilian',
      lastName: '',
      email: 'hayjay@gmail.com',
      password: 'ajirioghene',
      isAdmin: 'false',
    };
    chai.request(app)
      .post('/api/v2/auth/signup/admin')
      .set('authorization', adminToken)
      .send(seven)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter a valid lastName.');
        done();
      });
  });

  it('should not signup Admin/Staff when the password is missing', (done) => {
    const eight = {
      firstName: 'Amaka',
      lastName: 'Ezike',
      email: 'amakaezike@gmail.com',
      isAdmin: 'false',
    };
    chai.request(app)
      .post('/api/v2/auth/signup/admin')
      .set('authorization', adminToken)
      .send(eight)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter a password with at least 8 characters.');
        done();
      });
  });

  it('should not signup when isAdmin is not specified', (done) => {
    const nine = {
      firstName: 'Amaka',
      lastName: 'Ezike',
      email: 'amakaezike@gmail.com',
      password: 'Amakaezike',
    };
    chai.request(app)
      .post('/api/v2/auth/signup/admin')
      .set('authorization', adminToken)
      .send(nine)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Indicate Administrative Post');
        done();
      });
  });
});

// Signin Test
describe('POST/auth signin', () => {
  const signinUrl = '/api/v2/auth/signin';
  it('should signin an existing user(Admin)', (done) => {
    chai.request(app)
      .post(signinUrl)
      .send({
        email: 'ezikeonyinyefavour@gmail.com',
        password: '123456789',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        done();
      });
  });

  it('should signin an existing user(Staff)', (done) => {
    chai.request(app)
      .post(signinUrl)
      .send({
        email: 'emekaike@gmail.com',
        password: '123456789',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(200);
        done();
      });
  });

  it('should not signin an unregistered user', (done) => {
    chai.request(app)
      .post(signinUrl)
      .send({
        email: 'magrettasha@gmail.com',
        password: 'magrettasha',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        done();
      });
  });

  it('should not signin an invalid password', (done) => {
    chai.request(app)
      .post(signinUrl)
      .send({
        email: 'desmondelliot@gmail.com',
        password: '12345678',
      })
      .end((err, res) => {
        expect(res.body.status).to.equal(400);
        done();
      });
  });
});
