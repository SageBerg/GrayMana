function login() {
  $.post('login', {username: $('#username').val(),
    password: $('#password').val()}, handleLogin);
}

function handleLogin(res) {
  CHUNKS = {}; //clear out any cached data
  window.sessionStorage.accessToken = res.token;
  setup();
  $('#login_div').html(''); //removes login view
}

function refreshToken() {
  $.post('refresh_token', {'token': window.sessionStorage.accessToken},
    function(res) {
      window.sessionStorage.accessToken = res.token;
  });
}
