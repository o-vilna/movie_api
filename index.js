/**
 * @file index.js is the main entry point for the Movie API
 * @author Olha Tsurenko
 * @see {@link https://github.com/o-vilna/movie_api|GitHub Repository}
 */
/**
 * @module index
 * @description Main module for the movie API handling all routes and middleware configurations
 */

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");

const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
const Actors = Models.Actor;

/**
 * Express application instance
 * @type {object}
 */
const app = express();
require("./passport");

/**
 * Configure middleware
 * @function
 */
app.use(express.static("public"));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true,
  })
);
app.use(methodOverride());

app.use(cors());

let auth = require("./auth")(app);

// Allowed origins for CORS
let allowedOrigins = ["http://localhost:8080", "http://https://m-flixx.netlify.app","http://localhost:1234"]

// Only certain origins
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The The CORS policy for this application doesn't allow access from origin" +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

/**
 * @name GetAllMovies
 * @function
 * @memberof module:index
 * @description Get all movies
 * @route {GET} /movies
 * @authentication This route requires JWT authentication.
 * @returns {Array.<Movie>} 200 - An array of movies
 * @returns {Error} 500 - Internal server error
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error:" + error);
      });
  }
);

/**
 * @name GetMovieByTitle
 * @function
 * @memberof module:index
 * @description Get movie by title
 * @param {string} Title - The title of the movie
 * @returns {Movie} 200 - A movie object
 * @returns {Error} 404 - Movie not found
 * @returns {Error} 500 - Internal server error
 */
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((title) => {
        if (!title) {
          return res.status(404).send("Movie not found.");
        }
        res.status(200).json(title);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @name GetGenreByName
 * @function
 * @memberof module:index
 * @description Get genre by name
 * @param {string} Name - The name of the genre
 * @returns {Object} 200 - Genre object
 * @returns {Error} 404 - No movies found for this genre
 * @returns {Error} 500 - Internal server error
 */
app.get(
  "/genres/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Genre.Name": req.params.Name })
      .then((movies) => {
        if (movies.length === 0) {
          return res.status(404).send("No movies found for this genre.");
        }
        res.status(200).json(movies.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @name GetDirectorByName
 * @function
 * @memberof module:index
 * @description Get director by name
 * @param {string} Name - The name of the director
 * @returns {Object} 200 - Director object
 * @returns {Error} 404 - Director not found
 * @returns {Error} 500 - Internal server error
 */
app.get(
  "/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.Name })
      .then((movies) => {
        if (!movies) {
          return res.status(404).send("Director not found.");
        }
        res.status(200).json(movies.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @name GetMoviesByActor
 * @function
 * @memberof module:index
 * @description Get movies by actor name
 * @param {string} Name - The name of the actor
 * @returns {Object} 200 - Movies associated with the actor
 * @returns {Error} 404 - Actor not found or no movies found for this actor
 * @returns {Error} 500 - Internal server error
 */
app.get(
  "/actors/:Name/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Actors.findOne({ Name: req.params.Name })
      .then((actor) => {
        if (!actor) {
          return res.status(404).send("Actor not found.");
        }

        return Movies.find({ Actors: actor._id }).then((movies) => {
          if (movies.length === 0) {
            return res.status(404).send("No movies found for this actor.");
          }

          res.status(200).json({
            actor: actor.Name,
            movies: movies,
          });
        });
      })
      .catch((err) => {
        console.error("Error finding actor:", err);
        res.status(500).send("Error: " + err.message);
      });
  }
);

/**
 * @name GetMovieRating
 * @function
 * @memberof module:index
 * @description Get movie rating by title
 * @param {string} Title - The title of the movie
 * @returns {Object} 200 - Movie rating information
 * @returns {Error} 404 - Movie not found
 * @returns {Error} 500 - Internal server error
 */
app.get(
  "/movies/:Title/rating",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((movies) => {
        if (!movies) {
          return res.status(404).send("Movie not found."); // Перевіряємо, чи фільм знайдено
        }
        res.status(201).json({ Title: movies.Title, Rating: movies.Rating });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @name GetMovieReleaseYear
 * @function
 * @memberof module:index
 * @description Get movie release year by title
 * @param {string} Title - The title of the movie
 * @returns {Object} 200 - Movie release year information
 * @returns {Error} 404 - Movie not found
 * @returns {Error} 500 - Internal server error
 */
app.get(
  "/movies/:Title/releaseyear",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((movies) => {
        if (!movies) {
          return res.status(404).send("Movie not found.");
        }
        res.status(201).json({
          Title: movies.Title,
          ReleaseYear: movies.ReleaseYear,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @name GetAllUsers
 * @function
 * @memberof module:index
 * @description Get list of all users
 * @returns {Array.<User>} 200 - An array of users
 * @returns {Error} 500 - Internal server error
 */
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((error) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @name RegisterUser
 * @function
 * @memberof module:index
 * @description User registration
 * @param {Object} userData - User data including username, password, and email
 * @returns {User} 201 - Created user
 * @returns {Error} 400 - User already exists
 * @returns {Error} 422 - Validation error
 * @returns {Error} 500 - Internal server error
 */
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not apper to be valid").isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);

    console.log("Hashed password:", hashedPassword);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birth_date: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error:" + error);
      });
  }
);

/**
 * @name UpdateUser
 * @function
 * @memberof module:index
 * @description Update user information
 * @param {string} Username - The username
 * @param {Object} userData - The user data to update
 * @returns {User} 200 - Updated user
 * @returns {Error} 404 - User not found
 * @returns {Error} 422 - Validation error
 * @returns {Error} 500 - Internal server error
 */
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Email", "Email does not appear to be valid").isEmail(),
    check("Birthday", "Invalid date, use format YYYY-MM-DD")
      .optional()
      .matches(/^\d{4}-\d{2}-\d{2}$/),
    check("Password", "Password must be at least 6 characters")
      .optional()
      .isLength({ min: 6 }),
  ],
  async (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Get user from DB
    const currentUser = await Users.findOne({ Username: req.params.Username });

    if (!currentUser) {
      return res.status(404).send("User not found");
    }

    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }

    // Update password only if it's provided in the request
    let updatedFields = {
      Username: req.body.Username,
      Email: req.body.Email,
      Birth_date: req.body.Birthday,
    };

    if (req.body.Password) {
      updatedFields.Password = Users.hashPassword(req.body.Password);
    }

    try {
      let updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $set: updatedFields },
        { new: true }
      );

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    }
  }
);

/**
 * @name AddMovieToFavorites
 * @function
 * @memberof module:index
 * @description Add a movie to a user's favorite list
 * @param {string} Username - The username
 * @param {string} MovieID - The movie ID
 * @returns {User} 201 - Updated user with the movie added to favorites
 * @returns {Error} 500 - Internal server error
 */
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }
    )
      .then((updatedUser) => {
        console.log("Updated user: ", updatedUser);
        res.status(201).json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get all favorite movies for a user
app.get(
  "/users/:Username/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        // Check user
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({
          Username: user.Username,
          FavoriteMovies: user.FavoriteMovies || [], // Переконайтесь, що поле називається 'favoriteMovies'
        });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ message: "Server error.", error: error.message });
      });
  }
);

// Remove movie from favorites
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .send(`${req.params.Username} User was not found`);
        }

        res.status(200).json({
          Username: user.Username,
          FavoriteMovies: user.FavoriteMovies || [], // Переконайтесь, що поле називається 'favoriteMovies'
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Deregister user
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(404).send(req.params.Username + " was not found");
          4;
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Default welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the world of movies!");
});

// Documentation route
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
// Start the servers
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
//mongoose.connect("mongodb://localhost:27017/mfDB", {});

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/**
 * Export Express app
 * @type {object}
 */
module.exports = app;
