DROP TABLE IF EXISTS addMovie;

CREATE TABLE IF NOT EXISTS addMovie (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    comment VARCHAR(100000),
    img VARCHAR(255)

);