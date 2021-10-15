use actix_web::{App, HttpServer, web, get, post, delete, HttpResponse, Responder};
use std::thread;
use r2d2_postgres::{postgres::NoTls, PostgresConnectionManager};
use lazy_static::lazy_static;
use serde_json::json;

// lazy_static! {
//     static ref POOL: r2d2::Pool<PostgresConnectionManager<NoTls>> = {
//         let manager = PostgresConnectionManager::new(
//             "host=findmygroup user=findmygroup password=pass".parse().unwrap(),
//             NoTls,
//         );
//         r2d2::Pool::new(manager).unwrap()
//     };
// }

// [/groups] POST: Add a new group, return group entity.
async fn create_group(body: String) -> impl Responder {
    println!("{}", body);
    HttpResponse::Created().body(json!(body))
}

// - /groups/:id
//  - GET: Get group entity.
// #[get("/groups/{id}")]
// async fn find() -> impl Responder {
//     HttpResponse::Ok().json(
//         //User { id: 1, email: "tore@cloudmaker.dev".to_string() }
//     )
// }

// - /groups/:id
//  - DELETE: Delete group entity.
// #[delete("/groups/{id}")]
// async fn delete() -> impl Responder {
//     HttpResponse::Ok().json(json!({"message": "Deleted."}))
// }

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/groups", web::post().to(create_group))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
