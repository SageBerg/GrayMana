const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const session = require('express-session');

const GameHandlers = require('./game_handlers').GameHandlers;
const Handlers = require('./handlers').Handlers;
const logging = require('./logging');

//start server
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3002;

//configure server
server.listen(port);

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/../frontend/views/compiled_html'));
app.use(express.static(__dirname + '/../frontend'));
app.use(logging.middleware);
app.use(session({
  secret: process.env.GRAY_MANA_SESSSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 600 * 1000, //session expires after six minutes of inactivity
    secure: false //switch secure to true once using HTTPS
  }
}));

//start game
handlers = new Handlers();
gameHandlers = new GameHandlers();

//set up account and character creation routes
app.post('/login', handlers.login);
app.get('/characters', handlers.authMiddleware, handlers.getCharacters);
app.post('/characters', handlers.authMiddleware, handlers.newCharacter);
app.post('/accounts', handlers.newAccount, handlers.login);
app.post('/logout', handlers.authMiddleware, gameHandlers.logout);

//set up game routes
app.post('/game', handlers.authMiddleware, gameHandlers.startGame);

app.get('/chunks/:coords', handlers.authMiddleware, gameHandlers.chunk);
app.get('/chunk_size', handlers.authMiddleware, gameHandlers.chunkSize);
app.get('/character', handlers.authMiddleware, gameHandlers.character);
app.get('/treasure', handlers.authMiddleware, gameHandlers.treasure);
app.get('/chests', handlers.authMiddleware, gameHandlers.chests)

app.post('/command', handlers.authMiddleware, gameHandlers.command);
