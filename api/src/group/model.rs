use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct Group {
    pub id: Uuid,
    pub area_id: Uuid,
    pub name: String,
    pub password: String,
}
