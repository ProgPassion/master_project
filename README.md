This is the implementation of the application Crowd mapping for roads.
Its build using express js and for database engine it uses Postgresql.
After you clone the repository you first should enter in the project directory and run the command `npm install` to install all node dependencies.
Secondly you should enter to postgres cli and change the postgres password according to what you have specified as database password on .env file.
In postgres cli you write `\password`, it will ask you for the new password you want set.
Next from postgres user shell you write this command for creating the database as specified in .env file. `createdb -h localhost crowd_road`
It will ask you for the password you just set previously.
