// test/integration/login.test.js

const request = require('supertest');
const { expect } = require('chai');
const index = require('../../index.js'); // Replace with the path to your Express app

describe('POST /login', function() {
    it('should login successfully with correct username and password', function(done) {
        request(index)
            .post('/login')
            .send({ username: 'correctUsername', password: 'correctPassword' })
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('token');
                done();
            });
    });

    it('should fail to login with incorrect username', function(done) {
        request(index)
            .post('/login')
            .send({ username: 'wrongUsername', password: 'correctPassword' })
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('error');
                done();
            });
    });

    it('should fail to login with incorrect password', function(done) {
        request(index)
            .post('/login')
            .send({ username: 'correctUsername', password: 'wrongPassword' })
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('error');
                done();
            });
    });

    it('should fail to login with missing username', function(done) {
        request(index)
            .post('/login')
            .send({ password: 'correctPassword' })
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('error');
                done();
            });
    });

    it('should fail to login with missing password', function(done) {
        request(index)
            .post('/login')
            .send({ username: 'correctUsername' })
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err);
                expect(res.body).to.have.property('error');
                done();
            });
    });
});
