const jwt = require('jsonwebtoken');

var Auth = function() {};

Auth.prototype.isAuth = function(token) {
  try {
    if (jwt.verify(token, process.env.TOKEN_SECRET)) {
      return true;
    }
    return false;
  } catch (exception) {
    console.log(exception);
    return false;
  }
};

Auth.prototype.getEmailFromToken = function(token) {
  var decodedToken = jwt.decode(token, {complete: true});
  return decodedToken.payload.username;
};

exports.Auth = Auth;
