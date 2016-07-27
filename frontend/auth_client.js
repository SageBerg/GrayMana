function login() {
  $.post('login.json', {username: $('#username').val(),
    password: $('#password').val()}, handleLogin);
}

function handleLogin(res) {
  CHUNKS = {}; //clear out any cached data
  window.sessionStorage.accessToken = res.token;
  setup();
  $('#login-div').html(''); //removes login view
}

function refreshToken() {
  $.post('refresh_token.json', {'token': window.sessionStorage.accessToken},
    function(res) {
      window.sessionStorage.accessToken = res.token;
  });
}
