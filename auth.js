const jwtSecret = "your_jwt_secret";

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport");

let generateJWTToken = (user) => {
  console.log("Generating JWT token for user:", user.Username);
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

/* POST login. */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    console.log("Login request received:", req.body);
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error) {
        console.log("Passport authentication error:", error);
        return res.status(500).json({
          message: "Internal server error during authentication",
          error:error.message || error,
        });
      }

      if (!user) {
        console.warn("User not authenticated. Info:", info);
        return res.status(400).json({
          message:"Authentication failed. User not found or invalid credentials.",
          info: info,
        });
      }
        
      console.log("User authenticated successfully:", user.Username);
      // Login user
      req.login(user, { session: false }, (error) => {
        if (error) {
          console.log("Error during login process:", error);
          res.send(error);
        }
        //Token generation
        let token = generateJWTToken(user.toJSON());
        console.log("Token generated successfully for user:", user.Username);
        return res.json({ user, token });
      });
    })(req, res);
  });
};
