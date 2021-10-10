-- Your SQL goes here
CREATE TABLE "group" (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    area_id uuid NOT NULL,
    name varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    CONSTRAINT fk_area_id
      FOREIGN KEY(area_id)
        REFERENCES area(id)
        ON DELETE CASCADE
);
