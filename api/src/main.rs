use actix_web::{get, post, web, App, HttpServer, Responder};

// - /groups
//  - POST: Add a new group, return group entity.
#[post("/groups")]
pub async fn create_group(post: web::Json<NewPost>, pool: web::Data<PgPool>) -> impl Responder {
    println!("New POST request to create a group.");
    let result = Post::new_post(post.into_inner(), pool.as_ref()).await;

    match result {
        Ok(post) => HttpResponse::Ok().json(post),
        _ => HttpResponse::BadRequest().body("Error trying to create a new post")
    }
}

#[get("/{meme}")]
async fn index(web::Path(meme): web::Path<String>) -> impl Responder {
    format!("Hello {}!", meme)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(index))
        .bind("127.0.0.1:9666")?
        .run()
        .await
}
