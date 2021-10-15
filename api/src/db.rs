use crate::{group::Group};
use std::thread;
use r2d2_postgres::{postgres::NoTls, PostgresConnectionManager};
use lazy_static::lazy_static;

lazy_static! {
    static ref POOL: r2d2::Pool<PostgresConnectionManager<NoTls>> = {
        let manager = PostgresConnectionManager::new(
            "host=findmygroup user=findmygroup password=pass".parse().unwrap(),
            NoTls,
        );
        r2d2::Pool::new(manager).unwrap()
    };
}

pub fn init() {
    lazy_static::initialize(&POOL);
}

pub fn create_group(name: String) -> Group {
    pool = pool.clone();
    POOL.get()
        .map_err(|e| ApiError::new(500, format!("Failed getting db connection: {}", e)))
}
