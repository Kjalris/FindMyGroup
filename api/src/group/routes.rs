use crate::group::Group;
use actix_web::{get, post, put, delete, web, HttpResponse, Responder};
use serde_json::json;

// - /groups
//  - POST: Add a new group, return group entity.
#[post("/groups")]
async fn create(group: web::Json<Group>) -> impl Responder {
    HttpResponse::Created().json(group.into_inner())
}

// - /groups/:id
//  - GET: Get group entity.
#[get("/groups/{id}")]
async fn find() -> impl Responder {
    HttpResponse::Ok().json(
        //User { id: 1, email: "tore@cloudmaker.dev".to_string() }
    )
}

// - /groups/:id
//  - DELETE: Delete group entity.
#[delete("/groups/{id}")]
async fn delete() -> impl Responder {
    HttpResponse::Ok().json(json!({"message": "Deleted."}))
}

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    //cfg.service(find_all);
    cfg.service(find);
    cfg.service(create);
    //cfg.service(update);
    cfg.service(delete);
}
