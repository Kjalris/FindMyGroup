-- Your SQL goes here
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
