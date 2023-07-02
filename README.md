This is the implementation of the application Crowd mapping for roads.
Its build using express js and for database engine it uses Postgresql.
After you clone the repository you first should enter in the project directory and run the command `npm install` to install all node dependencies.
Secondly you should enter to postgres cli and change the postgres password according to what you have specified as database password on .env file.
In postgres cli you write `\password`, it will ask you for the new password you want set.
Next from postgres user shell you write this command for creating the database as specified in .env file. `createdb -h localhost crowd_road`
It will ask you for the password you just set previously.
In psql cli write `\c crowd_road` to enter to crowd_road database.
After that create the users and reports TABLES by entering the following query from init.sql file.

`CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255),
  role VARCHAR(255)
  )`

`CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  location VARCHAR(255),
  type VARCHAR(255),
  description VARCHAR(255),
  submit_timestamp TIMESTAMP,
  verdict_timestamp TIMESTAMP,
  status VARCHAR(255),
  user_id INT
)`

At the beginning is important to visit the following endpoint to create the admin user
`http://localhost:3000/auth/create-admin`
The default username is `admin` and default password is `test123`
