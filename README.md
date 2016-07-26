# Gray Mana
An MMO where you play as a spell caster

## Features
1. Highly configurable spells
2. Endless procedurally generated worlds
3. A building system, so you can make castles and stuff
4. Factions that you can create or join
5. Mobs with interesting strategies

## Note
This project is an exploration intended to lay the foundation for the alpha version of Gray Mana.
The game itself will probably be built with Unity.

### Areas we're* exploring
1. Software Architecture
2. Database Architecture
3. Security
4. User Interface Design
5. Game Design

\*It's mostly me working on Gray Mana, but I'd like to thank my friends and family for all the feedback and ideas.

## How to run Gray Mana (work in progress)
1. Clone this git repository
2. `$ cd GrayMana`
3. Install PostgreSQL (I'm running version 9.3.13)
4. Set up the necessary tables (sorry, instructions coming later)
5. `$ npm install`
6. `$ npm install -g nodemon`
7. `$ sudo PORT=3002 PSQLPASSWORD=<your_postgres_password> TOKEN_SECRET=<your_secret> nodemon server.js`
8. In your browser, navigate to http://localhost:3002.
