use actix_web::{get, web, App, HttpServer, Responder};

#[get("/api/v1/{meme}")]
async fn index(web::Path(meme): web::Path<String>) -> impl Responder {
    format!("Hello {}!", meme)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(index))
        .bind("127.0.0.1:8080")?
        .run()
        .await
}
