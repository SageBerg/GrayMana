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
1. `$ git clone https://github.com/SageBerg/GrayMana.git`
2. `$ cd GrayMana`
3. Install PostgreSQL (I'm using version 9.3.13).
4. `$ createdb graymana`
5. `$ psql graymana`
6. `CREATE TABLE chunks (id SERIAL PRIMARY KEY NOT NULL, chunk INT[40][40] NOT NULL, coords VARCHAR(64) NOT NULL, world_id INT);`
7. `CREATE TABLE users (id SERIAL PRIMARY KEY NOT NULL, email VARCHAR(64) NOT NULL, password VARCHAR(64) NOT NULL, world_id INT);`
8. `INSERT INTO users (email, password, world_id) VALUES ('person@example.com', 'not_a_real_password_used_anywhere_else', 1);`
9. `\q`
10. `$ npm install`
11. `$ sudo npm install -g nodemon`
12. `$ sudo PORT=3002 PSQL_USER=<your_postgres_user> PSQL_PASSWORD=<your_postgres_password> TOKEN_SECRET=<your_secret> nodemon server.js`
13. In your browser, navigate to [http://localhost:3002](http://localhost:3002).

## How to test Gray Mana
1. `$ sudo npm install -g mocha`
2. `$ PSQL_USER=<your_postgres_user> PSQL_PASSWORD=<your_postgres_password> TOKEN_SECRET=<your_secret> mocha`

## How to transpile frontent/index.pug into frontend/index.html and minify it
1. `$ sudo npm install -g pug-cli`
2. `$ cd frontend`
3. `$ pug -P index.pug`
4. `$ sudo npm install -g html-minifier`
5. `$ html-minifier --collapse-whitespace index.html > interim_index.html`
6. `$ mv interim_index.html index.html`

## How to transpile frontend/style.scss into frontend/into style.css
1. Install Ruby (I'm using version 2.3).
2. `$ sudo gem install sass`
3. `$ sass --watch frontend/style.scss:frontend/style.css`
