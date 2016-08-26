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
app.use(express.static(__dirname + '/../frontend'));
app.use(bodyParser.urlencoded({extended: false}));

//start game
Promise.all(
  [state = new State()]
).then(
  handlers = new Handlers(state)
);

//set up routes
app.post('/login.json', handlers.respondWithLogin);
app.post('/chunk.json', handlers.respondWithChunk);
app.post('/chunkSize.json', handlers.respondWithChunkSize);
app.post('/load_character.json', handlers.respondWithCharacter);
app.post('/move', handlers.respondWithMove);
app.post('/refresh_token.json', handlers.respondWithNewToken);
app.post('/get_treasure.json', handlers.respondWithTreasureDrop);
