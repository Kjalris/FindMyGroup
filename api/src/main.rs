use actix_web::{App, HttpServer, web, get, post, delete, HttpResponse, Responder, Error, error};
use std::thread;
use r2d2_postgres::{postgres::NoTls, PostgresConnectionManager};
use lazy_static::lazy_static;
use serde_json::{json, Value};
use futures::StreamExt;
use json::JsonValue;

const MAX_SIZE: usize = 262_144; // max payload size is 256k

// lazy_static! {
//     static ref POOL: r2d2::Pool<PostgresConnectionManager<NoTls>> = {
//         let manager = PostgresConnectionManager::new(
//             "host=findmygroup user=findmygroup password=pass".parse().unwrap(),
//             NoTls,
//         );
//         r2d2::Pool::new(manager).unwrap()
//     };
// }

// [/groups] POST: Add a new group, return group entity. https://github.com/actix/examples
async fn create_group(mut payload: web::Payload) -> Result<HttpResponse, Error> {
    // payload is a stream of Bytes objects
    let mut body = web::BytesMut::new();
    while let Some(chunk) = payload.next().await {
        let chunk = chunk?;
        // limit max size of in-memory payload
        if (body.len() + chunk.len()) > MAX_SIZE {
            return Err(error::ErrorBadRequest("overflow"));
        }
        body.extend_from_slice(&chunk);
    }

    // body is loaded, now we can deserialize serde-json
    let obj = serde_json::from_slice(&body)?;
    Ok(HttpResponse::Ok().json(obj)) // <- send response
    // TODO: look here? https://github.com/actix/examples/blob/master/json/json/src/main.rs
}

// [/groups/:id] GET: Get group entity.
async fn get_group() -> impl Responder {
    HttpResponse::Ok().json(
        json!({"meme": "meme"})
        //User { id: 1, email: "tore@cloudmaker.dev".to_string() }
    )
}

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
            .route("/groups/{id}", web::get().to(get_group))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
