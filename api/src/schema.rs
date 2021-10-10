table! {
    area (id) {
        id -> Uuid,
        area -> Box,
    }
}

table! {
    group (id) {
        id -> Uuid,
        area_id -> Uuid,
        name -> Varchar,
        password -> Varchar,
    }
}

table! {
    location (id) {
        id -> Uuid,
        member_id -> Uuid,
        timestamp -> Timestamp,
        point -> Point,
    }
}

table! {
    member (id) {
        id -> Uuid,
        group_id -> Uuid,
        role -> Int2,
        nickname -> Varchar,
    }
}

joinable!(group -> area (area_id));
joinable!(location -> member (member_id));
joinable!(member -> group (group_id));

allow_tables_to_appear_in_same_query!(
    area,
    group,
    location,
    member,
);
