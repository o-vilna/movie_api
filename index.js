const express = require("express");
morgan = require("morgan");

const app = express();

const bodyParser = require("body-parser");
methodOverride = require("method-override");

let topMovies = [
  {
    title: "Pulp Ficion",
    director: "Quentin Tarantino",
    year: 1994,
    genre: "Drug Crime",
  },
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    year: 1994,
    genre: "Drama",
  },
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: 1972,
    genre: "Crime, Drama",
  },
  {
    title: "Schindlers List",
    director: "Steven Spielberg",
    year: 1993,
    genre: "Epic, Drama",
  },
  {
    title: "The Green Mile",
    director: "Frank Darabont",
    year: 1999,
    genre: "Period Drama",
  },
  {
    title: "Requiem for a Dream",
    director: "Darren Aronofsky",
    year: 2000,
    genre: "Psychological Drama",
  },
  {
    title: "Forrest Gump",
    director: "Robert Zemeckis",
    year: 1994,
    genre: "Epic, Drama",
  },
  {
    title: "One Flew Over the Cuckoos Nest",
    director: "Milos Forman",
    year: 1975,
    genre: "Medical Drama",
  },
  {
    title: "Se7en",
    director: "David Fincher",
    year: 1995,
    genre: "Cop Drama",
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    director: "Peter Jackson",
    year: 2003,
    genre: "Fantasy Epic",
  },
];
// GET USE requests
app.use(express.static("public"));
app.use(morgan("common"));

app.get("/movies", (req, res) => {
  res.json(topMovies);
});
app.get("/", (req, res) => {
  res.send("Welcome to the world of movies!");
});
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(methodOverride());

/*app.get("/cause-error", (req, res, next) => {
  const err = new Error("This is a simulated error!");
  err.status = 500; //
  next(err); // Передаємо помилку в middleware для обробки помилок
});*/

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
//listen for requests
app.listen(8080, () => {
  console.log("your app is listening on port 8080.");
});
