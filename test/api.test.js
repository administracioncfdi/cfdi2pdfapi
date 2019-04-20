const request = require('supertest');
const { expect } = require('chai');
const fs = require('fs');
const app = require('../app');

const xmlString = fs.readFileSync('test/test.xml', 'utf8');

describe('API Tests', () => {
  const apiValues = {
    xml: xmlString,
  };
  describe('POST /mirror', () => {
    it('should respond with mirror JSON', done => {
      request(app)
        .post('/mirror')
        .send({ heeey: 'ya' })
        .end((_err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.body).to.deep.equal({ heeey: 'ya' });
          done();
        });
    });
  });
  describe('POST /pdf', () => {
    it('should respond with 200 OK', done => {
      request(app)
        .post('/pdf')
        .send(apiValues)
        .end((_err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
    it('should respond with 500 if no xml is sent', done => {
      request(app)
        .post('/pdf')
        .send({
          factura: '',
        })
        .end((_err, res) => {
          expect(res.statusCode).to.equal(500);
          done();
        });
    });
  });
});
