use actix_web::{get, post, web, App, HttpServer, HttpResponse, Responder};

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
