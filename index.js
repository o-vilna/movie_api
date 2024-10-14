const express = require("express");
morgan = require("morgan");
const bodyParser = require("body-parser");
methodOverride = require("method-override");

const app = express();

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Actors = Models.Actor;

const cors = require("cors");

const { check, validationResult } = require("express-validator");

// Allowed origins for CORS
let allowedOrigins = ["http://localhost:8080", "http://testsite.com"];

// Middleware Setup
app.use(express.static("public"));
app.use(morgan("common"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The The CORS policy for this application doesn’t allow access from origin" +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

app.use(bodyParser.json());
app.use(methodOverride());

// Get all movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error:" + error);
      });
  }
);

// Get movie by title
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((title) => {
        res.status(201).json(title);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get genre by name
app.get(
  "/genres/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Genre.Name": req.params.Name })
      .then((movies) => {
        if (movies.length === 0) {
          return res.status(404).send("No movies found for this genre.");
        }
        res.status(210).json(movies.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get director by name
app.get(
  "/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ "Director.Name": req.params.Name })
      .then((movies) => {
        if (!movies) {
          return res.status(404).send("Director not found.");
        }
        res.status(201).json(movies.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get movies by actor name
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

          res.status(201).json({
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

// Get movies by rating
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

// Get movies by ReleaseYear
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

// Get list of all users
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

// User registration
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
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
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

// Update user information
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error:" + err);
      });
  }
);

//Add a movie to a user's favorite list
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
    Users.findOneAndUpdate(
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

        res
          .status(200)
          .send(
            `Movie with ID ${req.params.MovieID} has been removed from ${req.params.Username}'s favorites.`
          );
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
