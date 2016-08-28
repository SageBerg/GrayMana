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

Auth.prototype.validateEmail = function(email) {
  //credit for the next line goes to community wiki at http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email);
};

exports.Auth = Auth;
