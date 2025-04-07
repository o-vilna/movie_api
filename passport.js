/**
 * @module passport
 * @description Authentication module using Passport strategies
 */

const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/**
 * Local authentication strategy
 * @name localStrategy
 * @memberof module:passport
 * @function
 * @description Authenticates users using username and password
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "Username",
      passwordField: "Password",
    },
    async (username, password, callback) => {
      console.log("Attempting login for:", username);
      await Users.findOne({ Username: username })
        .then((user) => {
          if (!user) {
            console.log("incorrect username");
            return callback(null, false, {
              message: "Incorrect username or password.",
            });
          }
          console.log("User found:", user.Username);
          if (!user.validatePassword(password)) {
            console.log("incorrect password");
            return callback(null, false, { message: "Incorrect password." });
          }
          console.log("finished");
          return callback(null, user);
        })
        .catch((error) => {
          if (error) {
            console.log(error);
            return callback(error);
          }
        });
    }
  )
);

/**
 * JWT authentication strategy
 * @name jwtStrategy
 * @memberof module:passport
 * @function
 * @description Authenticates users using JWT tokens
 */
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: "your_jwt_secret",
    },
    async (jwtPayload, callback) => {
      return await Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);

/**
 * Passport configuration object with strategies
 * @type {Object}
 */
module.exports = passport;

/**
 * Local authentication function
 * @function authenticate
 * @memberof module:passport
 * @description Authenticates user credentials against database
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {User|boolean} User object if authentication successful, false otherwise
 */

/**
 * JWT authentication function
 * @function authenticateJWT
 * @memberof module:passport
 * @description Authenticates JWT tokens
 * @param {Object} payload - JWT payload
 * @returns {User|Error} User object if authentication successful, error otherwise
 */
