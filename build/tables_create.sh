psql graymanadb -c "CREATE TABLE IF NOT EXISTS universes(
    id SERIAL PRIMARY KEY,
    name VARCHAR(16)
)"

psql graymanadb -c "CREATE TABLE IF NOT EXISTS worlds(
    id SERIAL PRIMARY KEY,
    universe_id INT references universes(id),

    name VARCHAR(32),

    chunks INT[][][],

    toxicity INT NOT NULL,
    gravity INT NOT NULL,
    heat INT NOT NULL,
    air INT NOT NULL
)"

psql graymanadb -c "CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(64) NOT NULL,
    password VARCHAR(32) NOT NULL
)"

psql graymanadb -c "CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(64) NOT NULL,
    password VARCHAR(32) NOT NULL
)"

psql graymanadb -c "CREATE TABLE IF NOT EXISTS characters(
    id SERIAL PRIMARY KEY,
    user_id INT references users(id),
    world_id INT references worlds(id),

    name VARCHAR(64) NOT NULL,
    school VARCHAR(16) NOT NULL,
    specialization VARCHAR(16),

    x_coord INT NOT NULL,
    y_coord INT NOT NULL,
    z_coord INT NOT NULL,

    damage_toxicity INT NOT NULL,
    damage_physical INT NOT NULL,
    damage_heat INT NOT NULL,
    damage_hunger INT NOT NULL,
    damage_suffocation INT NOT NULL,
    damage_sleep INT NOT NULL,
    damage_loneliness INT NOT NULL,
    damage_mental INT NOT NULL
)"

psql graymanadb -c "CREATE TABLE IF NOT EXISTS spells(
    id SERIAL PRIMARY KEY,
    
    name VARCHAR(32) NOT NULL,
    school VARCHAR(16) NOT NULL,
    description VARCHAR(512),

    base_cost INT NOT NULL,
    
    area BOOLEAN NOT NULL,
    casting_time BOOLEAN NOT NULL,
    duration BOOLEAN NOT NULL,
    power BOOLEAN NOT NULL,
    range BOOLEAN NOT NULL,
    stealth BOOLEAN NOT NULL
)"
