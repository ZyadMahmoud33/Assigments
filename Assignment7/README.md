# Assignment 7 - Setup & Notes

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in your MySQL credentials:
   ```
   DB_NAME=assignment7
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_HOST=localhost
   PORT=3000
   ```
3. Create the database first: `CREATE DATABASE assignment7;` (Sequelize creates the tables for you via `sequelize.sync()`, but not the database itself).
4. `npm start`

## Folder structure
```
config/       -> Sequelize connection (config/database.js)
models/       -> User (define), Post (init), Comment (init), plus index.js for associations
controllers/  -> business logic for each resource
routes/       -> route definitions, mounted in app.js
app.js        -> app entry point
bonus.js      -> LeetCode bonus solution
```

## Notes / things I tested by hand
- Ran the whole thing against a local MySQL instance end-to-end (signup, duplicate email check, password/name validation errors, post ownership checks on delete, comment ownership checks on update, bulk create, find-or-create, search, newest comments, nested details) — all endpoints returned the expected status codes and messages.
- Soft-delete on Post is real (`paranoid: true`): after `DELETE /posts/:postId`, the row stays in the table with `deletedAt` set instead of being removed, and normal queries automatically exclude it.
- One edge case worth knowing: `PUT /users/:id` uses `{ validate: false }` to skip Sequelize's validators (per the "skip validation option" requirement). That only skips validators — it does not skip MySQL's own `NOT NULL` constraints. So if you PUT to an id that doesn't exist yet (creating a brand new user) without sending a `password`, MySQL itself will reject it. In practice this endpoint is meant for updating a user that already has a password set, so it's usually not an issue — just something to keep in mind if you test creation through this route.
- `GET /user/:id` excludes only the `role` field, exactly as asked — it still returns the password field, since that wasn't part of the exclusion list in the spec.
