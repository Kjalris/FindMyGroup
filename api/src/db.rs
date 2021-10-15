use crate::api_error::ApiError;
use r2d2_postgres::{postgres::NoTls, PostgresConnectionManager};

type Pool = r2d2::Pool<PostgresConnectionManager<NoTls>>;

lazy_static! {
    static ref POOL: Pool = {
        let db_url = env::var("DATABASE_URL").expect("Database url not set");
        let manager = ConnectionManager::<PgConnection>::new(db_url);
        Pool::new(manager).expect("Failed to create db pool")
    };
}

pub fn init() {
    let manager = PostgresConnectionManager::new(
        "host=findmygroup user=findmygroup password=pass".parse().unwrap(),
        NoTls,
    );
    r2d2::Pool::new(manager).unwrap();
}

pub fn get_pool_instance() -> Result<DbConnection, ApiError> {
    pool = pool.clone();
    POOL.get()
        .map_err(|e| ApiError::new(500, format!("Failed getting db connection: {}", e)))
}
