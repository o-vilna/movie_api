# MyFlix Movie API

## Project Description

MyFlix is the server-side component of a web application for movie enthusiasts, providing access to information about various movies, directors, and genres. Users can register, update their personal information, and create a list of their favorite movies.

This REST API is built using Node.js, Express, and MongoDB, allowing users to make requests about movies, directors, and genres, as well as manage their profiles.

## Technologies Used

- **Node.js** - JavaScript runtime environment for server-side execution
- **Express** - Web framework for building the API
- **MongoDB** - Non-relational database for data storage
- **Mongoose** - ODM (Object Data Modeling) for MongoDB
- **Passport** - User authentication
- **JSON Web Tokens (JWT)** - Secure tokens for authorization
- **bcrypt** - Password hashing for security
- **JSDoc** - Documentation generation
- **Heroku** - Application hosting

## Features

### Essential Features:
- View a list of all movies
- Get data about a specific movie (description, genre, director, image URL)
- Retrieve information about a genre by name
- Get information about a director (biography, birth year, death year)
- Register new users
- Update user information (username, password, email, date of birth)
- Add a movie to the favorites list
- Remove a movie from the favorites list
- Deregister existing users

### Additional Features:
- View actors starring in movies
- View information about different actors
- Access additional movie information (release date, rating)

## Getting Started

To get started with the API, register a user and request an authentication token.

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/o-vilna/movie_api.git
   cd movie_api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the necessary environment variables:
   ```
   CONNECTION_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   PORT=8080
   JWT_SECRET=your_jwt_secret
   ```
   
   > **Important**: Never publish real account data, passwords, or secret keys. The values above are examples only. For a real project, use strong unique values and keep them confidential.

4. Start the server:
   ```
   npm start
   ```
