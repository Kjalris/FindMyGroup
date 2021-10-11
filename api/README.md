# API design
*Endpoint:* `/api`

- /groups
    - POST: Add a new group, return group entity.
- /groups/:id
    - GET: Get group entity.
    - DELETE: Delete group entity.
- /groups/:id/members
    - GET: Get list of all group members' entity.
    - POST: Add new group member, and return member entity.
- /groups/:id/locations
    - GET: Get list of location of group members.
- /groups/:id/members/:id
    - GET: Get a group members' entity.
    - DELETE: Delete a group members' entity
- /groups/:id/members/:id/location
    - POST: Update a group members' location.


# References
- [Create a blazingly fast REST API in Rust (Part 1/2)](https://hub.qovery.com/guides/tutorial/create-a-blazingly-fast-api-in-rust-part-1/) [[Git repo](https://github.com/evoxmusic/twitter-clone-rust)]
- [Diesel Getting Started](https://diesel.rs/guides/getting-started.html)
