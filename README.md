# FindMyGroup
5th semester mobile software Development project

## API design
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
    - PUT: Update a group members' location.


### References
- [Rust Web Development Tutorial: REST API](https://cloudmaker.dev/how-to-create-a-rest-api-in-rust/) [[Git repo](https://github.com/thecloudmaker/actix_tutorials/tree/master/rest_api)]
- [How to create an API with Rust and Postgres](https://blog.logrocket.com/create-a-backend-api-with-rust-and-postgres/) [[Git repo](https://github.com/olajohn-ajiboye/Rust-Rest-API)]
- [Create a blazingly fast REST API in Rust (Part 1/2)](https://hub.qovery.com/guides/tutorial/create-a-blazingly-fast-api-in-rust-part-1/) [[Git repo](https://github.com/evoxmusic/twitter-clone-rust)]
- [Diesel Getting Started](https://diesel.rs/guides/getting-started.html)
