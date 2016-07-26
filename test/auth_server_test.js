var assert = require('chai').assert;
var jwt = require('jsonwebtoken');

var Auth = require('../backend/auth_server').Auth;
var auth = new Auth();

describe('Auth.isAuth', function() {
  it('should return true', function() {
    var token = jwt.sign({username: 'sage@example.com'},
      process.env.TOKEN_SECRET, {expiresIn: '600s'});
    assert.equal(true, auth.isAuth(token));
  });
});

describe('Auth.isAuth', function() {
  it('should return false when token is expired', function() {
    var token = jwt.sign({username: 'sage@example.com'},
      process.env.TOKEN_SECRET, {expiresIn: '0s'});
    assert.equal(false, auth.isAuth(token));
  });
});

describe('Auth.isAuth', function() {
  it('should return false when token is malformed', function() {
    var token = jwt.sign({username: 'sage@example.com'},
      'wrong_secret', {expiresIn: '600s'});
    assert.equal(false, auth.isAuth(token));
  });
});

describe('Auth.isAuth', function() {
  it('should return false when no token is provided', function() {
    assert.equal(false, auth.isAuth());
    assert.equal(false, auth.isAuth(null));
    assert.equal(false, auth.isAuth(undefined));
  });
});

describe('Auth.getEmailFromToken', function() {
  it('should return true with correct email', function() {
    var token = jwt.sign({username: 'sage@example.com'},
      process.env.TOKEN_SECRET, {expiresIn: '600s'});
    assert.equal('sage@example.com', auth.getEmailFromToken(token));
  });
});

describe('Auth.getEmailFromToken', function() {
  it('should return false with incorrect email', function() {
    var token = jwt.sign({username: 'x@coolsite.io'},
      process.env.TOKEN_SECRET, {expiresIn: '600s'});
    assert.notEqual('sage@example.com', auth.getEmailFromToken(token));
  });
});
