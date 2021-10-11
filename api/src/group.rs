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

#[table_name = "group"]
#[derive(Queryable, Insertable)]
pub struct GroupDB {
    pub id: Uuid,
    pub created_at: NaiveDateTime,
    pub message: String,
}

impl TweetDB {
    fn to_tweet(&self) -> Tweet {
        Tweet {
            id: self.id.to_string(),
            created_at: Utc.from_utc_datetime(&self.created_at),
            message: self.message.clone(),
            likes: vec![],
        }
    }
}
