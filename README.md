This is the implementation of the application Crowd mapping for roads.
Its build using express js and for database engine it uses Postgresql.
After you clone the repository you first should enter in the project directory and run the command `npm install` to install all node dependencies.
Secondly you should enter to postgres cli and change the postgres password according to what you have specified as database password on .env file.
In postgres cli you write `\password`, it will ask you for the new password you want set.
Next from postgres user shell you write this command for creating the database as specified in .env file. `createdb -h localhost crowd_road`
It will ask you for the password you just set previously.
In psql cli write `\c crowd_road` to enter to crowd_road database.
After that create the users TABLE by entering the following query.

`CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255),
  role VARCHAR(255))
`

In this project as password hash algorithm we use bcrypt.
The default admin password is `test123`. 
After creating the table insert the admin credentials in users table as in below

`INSERT INTO users(username, password, role) VALUES('admin', '$2b$10$5Mu4qGRC35gVcgEjAH4cMeJ7CytpKUoXxqFgUhpy0gYwl0GnsWsZS', 'admin')`

The password is the encryption of phrase 'test123' using bcrypt algorithm with round 10.
