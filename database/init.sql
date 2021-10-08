USE findmygroup;

CREATE TABLE area (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    area box NOT NULL
);

CREATE TABLE group (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    area_id uuid NOT NULL,
    name varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    CONSTRAINT fk_area_id
      FOREIGN KEY(area_id)
        REFERENCES area(id)
        ON DELETE CASCADE
);

CREATE TABLE member (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id uuid NOT NULL,
    role smallint NOT NULL,
    nickname varchar(255) NOT NULL,
    CONSTRAINT fk_group_id
      FOREIGN KEY(group_id)
        REFERENCES group(id)
        ON DELETE CASCADE
);

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
