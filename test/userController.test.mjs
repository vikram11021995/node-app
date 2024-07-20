import {chai} from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import { index } from '../index.js';

// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const sinon = require('sinon');
// // const request = require('supertest');
// // const { expect } = require('chai');
// const index = require('../../index.js');
// const bcrypt = require('bcryptjs');

chai.use(chaiHttp);
const { expect } = chai;


let User;
let generateToken;
let userController;

describe('User Controller', () => {
  before(async () => {
    // Dynamically import CommonJS modules
    const userModule = await import('../models/User.js');
    User = userModule.default || userModule; // Adjust for CommonJS export
    const authorizationModule = await import('../utils/authorization.js');
    generateToken = authorizationModule.generateToken;
    userController = await import('../controllers/userController.js'); // Assuming userController is ES module
  });

  let req, res, next;


    beforeEach(() => {
      req = {
        body: {}
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
      };
      next = sinon.stub();
    });
  
    describe('signup', () => {
      it('should create a new user and return a token', async () => {
        req.body = {
          username: 'testuser',
          password: 'testpassword',
          userRole: 'customer'
        };
  
        // Stub methods to control their behavior
        sinon.stub(User, 'findOne').resolves(null); // Simulate user not existing
        sinon.stub(User.prototype, 'save').resolves(); // Simulate saving user
        sinon.stub(bcrypt, 'hash').resolves('hashedpassword'); // Simulate password hashing
        sinon.stub(generateToken).returns('testtoken'); // Simulate token generation
  
        // Call the signup function
        await userController.signup(req, res, next);
  
        // Verify the expected behavior
        expect(User.findOne.calledWith({ username: 'testuser' })).to.be.true;
        expect(bcrypt.hash.calledWith('testpassword')).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith({ token: 'testtoken' })).to.be.true;
  
        // Restore the stubbed methods
        User.findOne.restore();
        User.prototype.save.restore();
        bcrypt.hash.restore();
        generateToken.restore();
      });
  
      it('should return 400 if the user already exists', async () => {
        req.body = {
          username: 'existinguser',
          password: 'testpassword',
          userRole: 'customer'
        };
  
        // Stub methods to simulate user already existing
        sinon.stub(User, 'findOne').resolves({ username: 'existinguser' });
  
        // Call the signup function
        await userController.signup(req, res, next);
  
        // Verify the expected behavior
        expect(User.findOne.calledWith({ username: 'existinguser' })).to.be.true;
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: 'User already exists' })).to.be.true;
  
        // Restore the stubbed method
        User.findOne.restore();
      });
    });
  
    describe('login', () => {
      it('should login an existing user and return a token', async () => {
        req.body = {
          username: 'testuser',
          password: 'testpassword'
        };
  
        // Stub methods to simulate existing user and password verification
        sinon.stub(User, 'findOne').resolves({
          username: 'testuser',
          password: 'hashedpassword'
        });
        sinon.stub(bcrypt, 'compare').resolves(true);
        sinon.stub(generateToken).returns('testtoken');
  
        // Call the login function
        await userController.login(req, res, next);
  
        // Verify the expected behavior
        expect(User.findOne.calledWith({ username: 'testuser' })).to.be.true;
        expect(bcrypt.compare.calledWith('testpassword', 'hashedpassword')).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ user: { username: 'testuser', password: 'hashedpassword' }, token: 'testtoken' })).to.be.true;
  
        // Restore the stubbed methods
        User.findOne.restore();
        bcrypt.compare.restore();
        generateToken.restore();
      });
  
      it('should return 400 if the user does not exist', async () => {
        req.body = {
          username: 'nonexistentuser',
          password: 'testpassword'
        };
  
        // Stub method to simulate user not existing
        sinon.stub(User, 'findOne').resolves(null);
  
        // Call the login function
        await userController.login(req, res, next);
  
        // Verify the expected behavior
        expect(User.findOne.calledWith({ username: 'nonexistentuser' })).to.be.true;
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: 'Invalid Username credentials' })).to.be.true;
  
        // Restore the stubbed method
        User.findOne.restore();
      });
  
      it('should return 400 if the password is incorrect', async () => {
        req.body = {
          username: 'testuser',
          password: 'wrongpassword'
        };
  
        // Stub methods to simulate user existing and incorrect password
        sinon.stub(User, 'findOne').resolves({
          username: 'testuser',
          password: 'hashedpassword'
        });
        sinon.stub(bcrypt, 'compare').resolves(false);
  
        // Call the login function
        await userController.login(req, res, next);
  
        // Verify the expected behavior
        expect(User.findOne.calledWith({ username: 'testuser' })).to.be.true;
        expect(bcrypt.compare.calledWith('wrongpassword', 'hashedpassword')).to.be.true;
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: 'Invalid Password credentials' })).to.be.true;
  
        // Restore the stubbed methods
        User.findOne.restore();
        bcrypt.compare.restore();
      });
    });
  
    describe('API Routes', () => {
      it('should return 201 for the signup route', (done) => {
        chai.request(index)
          .post('/api/user/signup')
          .send({ username: 'testuser', password: 'testpassword', userRole: 'customer' })
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('token');
            done();
          });
      });
    });
  });