psql graymanadb -c "INSERT INTO universes (
    name
) VALUES (
    'Universe1'
)"

psql graymanadb -c "INSERT INTO worlds (
    universe_id,
    name,
    toxicity,
    gravity,
    heat,
    air
) VALUES (
    1, 
    'World1',
    0,
    0,
    0,
    0
)"

psql graymanadb -c "INSERT INTO users (
    email,
    password
) VALUES (
    'person@example.com',
    'not_a_real_password'
)"
   
psql graymanadb -c "INSERT INTO users (
    email,
    password
) VALUES (
    'person@example.io',
    'also_not_a_real_password'
)"

psql graymanadb -c "INSERT INTO characters(
    user_id,
    world_id,
    name,
    school,
    x_coord,
    y_coord,
    z_coord,
    damage_toxicity,
    damage_physical,
    damage_heat,
    damage_hunger,
    damage_suffocation,
    damage_sleep,
    damage_loneliness,
    damage_mental
) VALUES (
    1,
    1,
    'ExampleCharacter',
    'Infomancy',
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
)"

psql graymanadb -c "INSERT INTO characters(
    user_id,
    world_id,
    name,
    school,
    x_coord,
    y_coord,
    z_coord,
    damage_toxicity,
    damage_physical,
    damage_heat,
    damage_hunger,
    damage_suffocation,
    damage_sleep,
    damage_loneliness,
    damage_mental
) VALUES (
    2,
    1,
    'OtherCharacter',
    'Vitomancy',
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
)"
