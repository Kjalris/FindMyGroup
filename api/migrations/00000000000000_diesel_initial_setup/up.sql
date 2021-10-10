-- This file was automatically created by Diesel to setup helper functions
-- and other internal bookkeeping. This file is safe to edit, any future
-- changes will be added to existing projects as new migrations.




-- Sets up a trigger for the given table to automatically set a column called
-- `updated_at` whenever the row is modified (unless `updated_at` was included
-- in the modified columns)
--
-- # Example
--
-- ```sql
-- CREATE TABLE users (id SERIAL PRIMARY KEY, updated_at TIMESTAMP NOT NULL DEFAULT NOW());
--
-- SELECT diesel_manage_updated_at('users');
-- ```
CREATE OR REPLACE FUNCTION diesel_manage_updated_at(_tbl regclass) RETURNS VOID AS $$
BEGIN
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %s
                    FOR EACH ROW EXECUTE PROCEDURE diesel_set_updated_at()', _tbl);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION diesel_set_updated_at() RETURNS trigger AS $$
BEGIN
    IF (
        NEW IS DISTINCT FROM OLD AND
        NEW.updated_at IS NOT DISTINCT FROM OLD.updated_at
    ) THEN
        NEW.updated_at := current_timestamp;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Your SQL goes here
CREATE TABLE IF NOT EXISTS area (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    area box NOT NULL
);
CREATE TABLE IF NOT EXISTS "group" (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    area_id uuid NOT NULL,
    name varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    CONSTRAINT fk_area_id
      FOREIGN KEY(area_id)
        REFERENCES area(id)
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS member (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id uuid NOT NULL,
    role smallint NOT NULL,
    nickname varchar(255) NOT NULL,
    CONSTRAINT fk_group_id
      FOREIGN KEY(group_id)
        REFERENCES "group"(id)
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS location (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id uuid UNIQUE NOT NULL,
    timestamp timestamp NOT NULL DEFAULT NOW(),
    point point NOT NULL,
    CONSTRAINT fk_member_id
      FOREIGN KEY(member_id)
        REFERENCES member(id)
        ON DELETE CASCADE
);
