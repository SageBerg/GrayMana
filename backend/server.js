const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const Handlers = require('./handlers').Handlers;
const GameHandlers = require('./game_handlers').GameHandlers;

//start server
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3002;
server.listen(port);

//configure server
app.use(express.static(__dirname + '/../frontend/views/compiled_html'));
app.use(express.static(__dirname + '/../frontend'));
app.use(bodyParser.urlencoded({extended: false}));

//start game
handlers = new Handlers();
gameHandlers = new GameHandlers();

//set up account and character creation routes
app.post('/login.json', handlers.respondWithLogin);
app.post('/create_new_account.json', handlers.newAccount);
app.post('/create_new_character.json', handlers.authMiddleware, handlers.newCharacter);
app.post('/refresh_token.json', handlers.authMiddleware, handlers.respondWithNewToken);

//set up game routes
app.post('/chunk.json', handlers.authMiddleware, gameHandlers.respondWithChunk);
app.post('/chunkSize.json', handlers.authMiddleware, gameHandlers.respondWithChunkSize);
app.post('/load_character.json', handlers.authMiddleware, gameHandlers.respondWithCharacter);
app.post('/move.json', handlers.authMiddleware, gameHandlers.respondWithMove);
app.post('/get_treasure.json', handlers.authMiddleware, gameHandlers.respondWithTreasureDrop);
