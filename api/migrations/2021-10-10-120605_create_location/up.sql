-- Your SQL goes here
CREATE TABLE location (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id uuid UNIQUE NOT NULL,
    timestamp timestamp NOT NULL DEFAULT NOW(),
    point point NOT NULL,
    CONSTRAINT fk_member_id
      FOREIGN KEY(member_id)
        REFERENCES member(id)
        ON DELETE CASCADE
);
