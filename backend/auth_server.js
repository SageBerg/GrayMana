var Auth = function() {};

Auth.prototype.isAuth = function(req) {
  try {
    if (req.session.userId !== undefined) {
      return true;
    }
    return false;
  } catch (exception) {
    console.log(exception);
    return false;
  }
};

Auth.prototype.validateEmail = function(email) {
  //credit for the next line goes to community wiki at http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email);
};

exports.Auth = Auth;
