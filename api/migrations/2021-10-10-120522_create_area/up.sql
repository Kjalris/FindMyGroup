-- Your SQL goes here
CREATE TABLE area (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    area box NOT NULL
);
