const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const State = require('./state_server').State;
const Handlers = require('./handlers').Handlers;

//start server
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3002;
server.listen(port);

//configure server
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({extended: false}));

//start game
Promise.all(
  [state = new State()]
).then(
  handlers = new Handlers(state)
);

//set up routes
app.post('/login', handlers.loginHandler);
app.post('/map.json', handlers.respondWithMap);
app.post('/move', handlers.respondWithMove);
app.post('/refresh_token', handlers.respondWithNewToken);
