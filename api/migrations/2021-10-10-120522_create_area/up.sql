-- Your SQL goes here
CREATE TABLE IF NOT EXISTS area (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    area box NOT NULL
);
