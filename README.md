# Crowd Mapping for Roads

This is the implementation of the application Crowd Mapping for Roads. It is built using Express.js and uses Postgresql as the database engine.

## Getting Started

1. Clone the repository.
2. Navigate to the project directory.
3. Run the following command to build both images of the container that contains the Node.js Express application and the container for the Postgresql database:

docker-compose up --build

4. The `docker-compose.yml` file contains environment variables for the Postgresql container setup. It also contains instructions to execute the `init.sql` file. This file contains two queries for creating the necessary tables that the application needs.

`CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255),
  role VARCHAR(255)
);

CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  location VARCHAR(255),
  type VARCHAR(255),
  description VARCHAR(255),
  submit_timestamp TIMESTAMP,
  verdict_timestamp TIMESTAMP,
  status VARCHAR(255),
  user_id INT
);
`

At the beginning, it is important to visit the following endpoint to create the admin user:

`GET http://localhost:3000/auth/create-admin`

The default username is admin, and the default password is test123.

#User Registration

Admin has the privilege to create simple users by accessing the endpoint:


`POST http://localhost:3000/auth/register`

with the following parameters:

`{
    "username": "<The username>",
    "password": "<The password>",
    "role": "user" // Specify the role as "user" for a simple user
}`

Reporting Requests

Users can report one of three categories of requests:

    Obstacle
    Pothole
    Road closure

Sample data that users can submit can be found in the submitDataSample.txt file.
