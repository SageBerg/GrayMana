function login() {
  $.post("login", {username: $("#username").val(),
    password: $("#password").val()}, handleLogin);
}

function handleLogin(res) {
  token = res.token;
  console.log(token);
  $.post("map_auth.json", {"token": token}, handleMap);
}

function handleMap(res) {
  console.log("got map with auth");
}
