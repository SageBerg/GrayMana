const jwt = require('jsonwebtoken');

var Auth = function() {};

Auth.prototype.isAuth = function(token) {
  if (jwt.verify(token, process.env.TOKEN_SECRET)) {
    return true;
  }
  return false;
}

Auth.prototype.getEmailFromToken = function(token) {
  var decodedToken = jwt.decode(token, {complete: true});
  return decodedToken.payload.username;
}

exports.Auth = Auth;
