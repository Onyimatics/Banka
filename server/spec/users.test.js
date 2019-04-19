import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';


const { expect } = chai;
chai.use(chaihttp);
const signupUrl = '/api/v1/auth/signup';

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
        firstName: 'Blessing',
        lastName: 'Onwughara',
        password: 'Blessing',
      })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Enter valid email, firstName & lastName.');
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
        expect(res.body.message).to.equal('Enter valid email, firstName & lastName.');
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
        expect(res.body.message).to.equal('Enter valid email, firstName & lastName.');
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

  // Signin Test
  describe('POST/auth signin', () => {
    const signinUrl = '/api/v1/auth/signin';
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
          email: 'mercyjohnson@gmail.com',
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
});
