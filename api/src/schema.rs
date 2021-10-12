table! {
    use diesel::sql_types::*;
    use postgis_diesel::sql_types::*;
    use diesel_geography::sql_types::*;

    area (id) {
        id -> Uuid,
        area_box -> Geography,
    }
}

table! {
    use diesel::sql_types::*;
    use postgis_diesel::sql_types::*;
    use diesel_geography::sql_types::*;

    group (id) {
        id -> Uuid,
        area_id -> Uuid,
        name -> Varchar,
        password -> Varchar,
    }
}

table! {
    use diesel::sql_types::*;
    use postgis_diesel::sql_types::*;
    use diesel_geography::sql_types::*;

    location (id) {
        id -> Uuid,
        member_id -> Uuid,
        timestamp -> Timestamp,
        point -> Geography,
    }
}

table! {
    use diesel::sql_types::*;
    use postgis_diesel::sql_types::*;
    use diesel_geography::sql_types::*;

    member (id) {
        id -> Uuid,
        group_id -> Uuid,
        role -> Int2,
        nickname -> Varchar,
        password -> Varchar,
    }
}

table! {
    use diesel::sql_types::*;
    use postgis_diesel::sql_types::*;
    use diesel_geography::sql_types::*;

    spatial_ref_sys (srid) {
        srid -> Int4,
        auth_name -> Nullable<Varchar>,
        auth_srid -> Nullable<Int4>,
        srtext -> Nullable<Varchar>,
        proj4text -> Nullable<Varchar>,
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
    spatial_ref_sys,
);
