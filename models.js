/**
 * @module models
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Movie schema
 * @type {mongoose.Schema}
 */
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }],
  ImagePath: String,
  Featured: Boolean,
  Rating: { type: Number },
  ReleaseYear: Date,
});

/**
 * User schema
 * @type {mongoose.Schema}
 */
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birth_date: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

/**
 * Hashes the password
 * @param {string} password - The password to hash
 * @returns {string} The hashed password
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validates the password
 * @param {string} password - The password to validate
 * @returns {boolean} True if valid, false otherwise
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

/**
 * Actor schema
 * @type {mongoose.Schema}
 */
let actorSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Bio: { type: String, required: true },
  Birth: Date,
  Death: Date,
});

/**
 * Movie model for accessing movie data in the database
 * @type {mongoose.Model}
 */
let Movie = mongoose.model("Movie", movieSchema);

/**
 * User model for accessing user data in the database
 * @type {mongoose.Model}
 */
let User = mongoose.model("User", userSchema);

/**
 * Actor model for accessing actor data in the database
 * @type {mongoose.Model}
 */
let Actor = mongoose.model("Actor", actorSchema);

/**
 * Exports the Movie model
 * @type {mongoose.Model}
 */
module.exports.Movie = Movie;

/**
 * Exports the User model
 * @type {mongoose.Model}
 */
module.exports.User = User;

/**
 * Exports the Actor model
 * @type {mongoose.Model}
 */
module.exports.Actor = Actor;
