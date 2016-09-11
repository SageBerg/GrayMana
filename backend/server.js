const express = require('express');
const session = require('express-session');
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
app.use(session({
  secret: process.env.GRAY_MANA_SESSSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

//start game
handlers = new Handlers();
gameHandlers = new GameHandlers();

//set up account and character creation routes
app.post('/login', handlers.respondWithLogin);
app.post('/characters', handlers.authMiddleware, handlers.getCharacters);
app.post('/create_new_account', handlers.newAccount);
app.post('/create_new_character', handlers.authMiddleware, handlers.newCharacter);
app.post('/refresh_token', handlers.authMiddleware, handlers.respondWithNewToken);

//set up game routes
app.post('/start_game', handlers.authMiddleware, gameHandlers.startGame);
app.post('/chunk', handlers.authMiddleware, gameHandlers.respondWithChunk);
app.post('/chunk_size', handlers.authMiddleware, gameHandlers.respondWithChunkSize);
app.post('/load_character', handlers.authMiddleware, gameHandlers.respondWithCharacter);
app.post('/move', handlers.authMiddleware, gameHandlers.respondWithMove);
app.post('/get_treasure', handlers.authMiddleware, gameHandlers.respondWithTreasureDrop);

app.post('/command', handlers.authMiddleware, gameHandlers.command);
