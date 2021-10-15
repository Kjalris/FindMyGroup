use actix_web::{App, HttpServer};

mod db;

mod group;

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    db::init();

    let mut server = HttpServer::new(||
        App::new()
            .configure(group::init_routes)
    );
    server.bind("127.0.0.1:9666");
    server.run().await
}
