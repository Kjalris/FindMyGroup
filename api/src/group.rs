use actix_web::web::{Data, Json, Path};
use actix_web::{web, HttpResponse};
use diesel::result::Error;
use diesel::{ExpressionMethods, Insertable, Queryable, RunQueryDsl};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::constants::{APPLICATION_JSON, CONNECTION_POOL_ERROR};
//use crate::area::{Area};
//use crate::member::{list_members, Member};
//use crate::location::{Location};
use crate::response::Response;
use crate::{DBPool, DBPooledConnection};

use super::schema::group;
use diesel::query_dsl::methods::{FilterDsl, LimitDsl, OrderDsl};
use std::str::FromStr;

pub type Groups = Response<Group>;

#[derive(Debug, Deserialize, Serialize)]
pub struct Group {
    pub id: String,
    pub name: String,
    pub password: String,
    //pub area: Vec<Area>,
    //pub members: Vec<Member>,
    //pub locations: Vec<Location>
}

impl Group {
    pub fn new(name: String) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            name,
            password: Uuid::new_v4().to_string(),   // CHANGE ME!
        }
    }

    pub fn to_group_db(&self) -> GroupDB {
        GroupDB {
            id: Uuid::new_v4(),
            name: self.name.clone(),
            password: Uuid::new_v4(),   // CHANGE ME
        }
    }
}

#[derive(Queryable, Insertable)]
#[table_name = "group"]
pub struct GroupDB {
    pub id: Uuid,
    pub name: String,
    pub password: Uuid,
}

impl GroupDB {
    fn to_group(&self) -> Group {
        Group {
            id: self.id.to_string(),
            name: self.name.clone(),
            password: Uuid::new_v4(),
            //created_at: Utc.from_utc_datetime(&self.created_at),
            //message: self.message.clone(),
            //likes: vec![],
        }
    }
}

fn get_group(_id: Uuid, conn: &DBPooledConnection) -> Result<Group, Error> {
    use crate::schema::group::dsl::*;

    let res = group.filter(id.eq(_id)).load::<GroupDB>(conn);
    match res {
        Ok(groups_db) => match groups_db.first() {
            Some(group_db) => Ok(group_db.to_group()),
            _ => Err(Error::NotFound),
        },
        Err(err) => Err(err),
    }
}

fn create_group(group: Group, conn: &DBPooledConnection) -> Result<Group, Error> {
    use crate::schema::group::dsl::*;

    let group_db = group.to_group_db();
    let _ = diesel::insert_into(group).values(&group_db).execute(conn);

    Ok(group_db.to_group())
}

fn delete_group(_id: Uuid, conn: &DBPooledConnection) -> Result<(), Error> {
    use crate::schema::group::dsl::*;

    let res = diesel::delete(group.filter(id.eq(_id))).execute(conn);
    match res {
        Ok(_) => Ok(()),
        Err(err) => Err(err),
    }
}

/// find a group by its id `/groups/{id}`
#[get("/groups/{id}")]
pub async fn get(path: Path<(String,)>, pool: Data<DBPool>) -> HttpResponse {
    let conn = pool.get().expect(CONNECTION_POOL_ERROR);
    let group =
        web::block(move || get_group(Uuid::from_str(path.0.as_str()).unwrap(), &conn)).await;

    match group {
        Ok(group) => {
            let conn = pool.get().expect(CONNECTION_POOL_ERROR);
            //let _likes = list_likes(Uuid::from_str(group.id.as_str()).unwrap(), &conn).unwrap();

            HttpResponse::Ok()
                .content_type(APPLICATION_JSON)
                //.json(group.add_likes(_likes.results))    // TODO: Skift likes til group members.
        }
        _ => HttpResponse::NoContent()
            .content_type(APPLICATION_JSON)
            .await
            .unwrap(),
    }
}

/// delete a group by its id `/groups/{id}`
#[delete("/groups/{id}")]
pub async fn delete(path: Path<(String,)>, pool: Data<DBPool>) -> HttpResponse {
    // in any case return status 204
    let conn = pool.get().expect(CONNECTION_POOL_ERROR);

    let _ = web::block(move || delete_group(Uuid::from_str(path.0.as_str()).unwrap(), &conn)).await;

    HttpResponse::NoContent()
        .content_type(APPLICATION_JSON)
        .await
        .unwrap()
}
