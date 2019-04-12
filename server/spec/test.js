import chai from 'chai';
import chaihttp from 'chai-http';
import app from '../app';

const { expect } = chai;
chai.use(chaihttp);

describe('Banka tests', () => {
  describe('Display welcome message', () => {
    it('should display welcome message on start', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(res.body.message).to.equal('Welcome to Banka API');
          expect(res).to.have.status(200);
          done();
        });
    });
    it('should throw an error for an invalid url', (done) => {
      chai.request(app)
        .get('/api/v1/dytuurifoo')
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
