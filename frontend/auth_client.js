function login() {
  $.post('login.json', {username: $('#username').val(),
    password: $('#password').val()}, handleLogin);
}

function handleLogin(res) {
  window.sessionStorage.accessToken = res.token;
  setup();

  //remove login view
  $('#login-div').html('');
  $('#login-div').css('height', 0);
}

function refreshToken() {
  $.post('refresh_token.json', {'token': window.sessionStorage.accessToken},
    function(res) {
      window.sessionStorage.accessToken = res.token;
  });
}
