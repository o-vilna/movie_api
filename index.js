const express = require("express");
morgan = require("morgan");
const bodyParser = require("body-parser");
methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

const app = express();

// Middleware Setup
app.use(express.static("public"));
app.use(morgan("common"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(methodOverride());

const users = [
  {
    id: uuidv4(),
    username: "john_doe",
    password: "Password123!",
    email: "john_doe@example.com",
    birthday: "1990-01-15",
    myFavorites: [],
  },
  {
    id: uuidv4(),
    username: "jane_smith",
    password: "Jane2023$",
    email: "jane_smith@example.com",
    birthday: "1985-06-22",
    myFavorites: [],
  },
  {
    id: uuidv4(),
    username: "peter_johnson",
    password: "Peter789#",
    email: "peter_johnson@example.com",
    birthday: "1992-08-30",
    myFavorites: [],
  },
  {
    id: uuidv4(),
    username: "bob_brown",
    password: "BobSecure1!",
    email: "bob_brown@example.com",
    birthday: "1988-04-17",
    myFavorites: [],
  },
  {
    id: uuidv4(),
    username: "charlie_green",
    password: "GreenC@2023",
    email: "charlie_green@example.com",
    birthday: "1995-12-02",
    myFavorites: [],
  },
  {
    id: uuidv4(),
    username: "david_wilson",
    password: "DavidW#456",
    email: "david_wilson@example.com",
    birthday: "1991-11-11",
    myFavorites: [],
  },
  {
    id: uuidv4(),
    username: "emma_thompson",
    password: "Thompson$7",
    email: "emma_thompson@example.com",
    birthday: "1987-05-09",
    myFavorites: [],
  },
  {
    id: uuidv4(),
    username: "frank_white",
    password: "White2024!",
    email: "frank_white@example.com",
    birthday: "1993-09-25",
    myFavorites: [],
  },
  {
    id: uuidv4(),
    username: "grace_kelly",
    password: "KellyGrace@12",
    email: "grace_kelly@example.com",
    birthday: "1990-02-14",
    myFavorites: [],
  },
  {
    id: uuidv4(),
    username: "henry_james",
    password: "JamesHenry$9",
    email: "henry_james@example.com",
    birthday: "1989-07-19",
    myFavorites: [],
  },
];

const movies = [
  {
    id: uuidv4(),
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology.",
    genre: {
      genreName: "Science Fiction",
      description:
        "A genre of speculative fiction that typically deals with imaginative and futuristic concepts.",
    },
    director: {
      name: "Christopher Nolan",
      bio: "Christopher Nolan is a British-American film director, producer, and screenwriter, known for his cerebral, often nonlinear storytelling.",
      birthYear: "1970",
      deathYear: null,
    },
    imageUrl: "https://example.com/inception.jpg",
    featured: true,
  },
  {
    id: uuidv4(),
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
    genre: {
      genreName: "Action",
      description:
        "A genre of film that emphasizes physical feats, including hand-to-hand combat, chases, and explosions.",
    },
    director: {
      name: "Christopher Nolan",
      bio: "Christopher Nolan is a British-American film director, producer, and screenwriter, known for his cerebral, often nonlinear storytelling.",
      birthYear: "1970",
      deathYear: null,
    },
    imageUrl: "https://example.com/dark-knight.jpg",
    featured: true,
  },
  {
    id: uuidv4(),
    title: "Pulp Fiction",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    genre: {
      genreName: "Crime",
      description:
        "A genre that revolves around the lives of criminals, the reasons behind their actions, and the consequences.",
    },
    director: {
      name: "Quentin Tarantino",
      bio: "Quentin Tarantino is an American filmmaker and screenwriter known for his satirical, nonlinear storylines and stylized violence.",
      birthYear: "1963",
      deathYear: null,
    },
    imageUrl: "https://example.com/pulp-fiction.jpg",
    featured: true,
  },
  {
    id: uuidv4(),
    title: "The Godfather",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    genre: {
      genreName: "Crime",
      description:
        "A genre that revolves around the lives of criminals, the reasons behind their actions, and the consequences.",
    },
    director: {
      name: "Francis Ford Coppola",
      bio: "Francis Ford Coppola is an American film director, producer, and screenwriter, known for his work on 'The Godfather' series.",
      birthYear: "1939",
      deathYear: null,
    },
    imageUrl: "https://example.com/godfather.jpg",
    featured: true,
  },
];

// Get all movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// Get movie by title
app.get("/movies/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const movie = movies.find((m) => m.title.toLowerCase() === title);

  if (movie) {
    res.json({
      description: movie.description,
      genre: movie.genre,
      director: movie.director.name,
      imageUrl: movie.imageUrl,
      featured: movie.featured,
    });
  } else {
    res.status(404).json({ message: "Movie not found" });
  }
});

// Get genre by name
app.get("/genres/:name", (req, res) => {
  // Extract the genre name from the request parameters
  const genreName = req.params.name.toLowerCase();

  // Find a movie with the matching genre
  const movie = movies.find(
    (m) =>
      m.genre &&
      typeof m.genre.genreName === "string" &&
      m.genre.genreName.toLowerCase() === genreName
  );

  // If a movie with the genre is found, return the genre description
  if (movie) {
    res.json({
      genre: movie.genre.genreName,
      description: movie.genre.description,
    });
  } else {
    res.status(404).json({ message: "Genre not found" });
  }
});

// Get director by name
app.get("/movies/directors/:name", (req, res) => {
  const directorName = decodeURIComponent(req.params.name).toLowerCase();
  const director = movies.find(
    (movie) => movie.director.name.toLowerCase() === directorName
  );
  if (director) {
    res.json(director.director);
  } else {
    res.status(404).json({ message: "Director not found" });
  }
});

// Get list of all users
app.get("/users", (req, res) => {
  res.json(users);
});

// User registration
app.post("/users", (req, res) => {
  const newUser = {
    id: uuidv4(),
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    birthday: req.body.birthday,
  };

  users.push(newUser);
  res.status(201).json({
    message: "User successfully created",
    user: newUser,
  });
});

// Update user information
app.put("/users/:username", (req, res) => {
  const user = users.find((u) => u.username === req.params.username);

  if (user) {
    user.username = req.body.username || user.username;
    user.password = req.body.password || user.password;
    user.email = req.body.email || user.email;
    user.birthday = req.body.birthday || user.birthday;

    res.json({
      message: "User info successfully updated",
      user: user,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

//Add a movie to a user's favorite list
app.post("/users/:username/myfavorites", (req, res) => {
  const { username } = req.params;
  const newFavorite = req.body; // отримуємо дані з тіла запиту
  if (!newFavorite.movieId) {
    return res.status(400).send("Missing movieId in request body");
  }
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).send("User not found.");
  }
  const movie = movies.find((m) => m.id === newFavorite.movieId);
  if (!movie) {
    return res.status(404).send("Movie not found.");
  }
  user.myFavorites = user.myFavorites || [];
  if (user.myFavorites.some((fav) => fav.id === movie.id)) {
    return res.status(409).send("Movie is already in favorites.");
  }

  // Add movie to myFavorites
  user.myFavorites.push({
    id: movie.id,
    title: movie.title,
    director: movie.director.name,
  });

  // Send a response
  res.status(201).json({
    message: `Movie "${movie.title}" has been added to favorites.`,
    myFavorites: user.myFavorites,
  });
});

// Get all favorite movies for a user
app.get("/users/:username/myfavorites", (req, res) => {
  const { username } = req.params;

  const user = users.find((u) => u.username === username);

  // Check user
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Повертаємо список улюблених фільмів
  res.status(200).json({
    myFavorites: user.myFavorites || [],
  });
});

// Remove movie from favorites
app.delete("/users/:username/myfavorites", (req, res) => {
  const { username } = req.params;
  const { movieId } = req.body; // Отримання movieId з тіла запиту

  // Find user
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Find movieIndex in myFavorites
  const movieIndex = user.myFavorites.findIndex((m) => m.id === movieId);
  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found in favorites." });
  }

  // Delete movie from myFavorites
  user.myFavorites.splice(movieIndex, 1);

  res.status(200).json({
    message: `Movie with ID ${movieId} has been removed from favorites.`,
    myFavorites: user.myFavorites,
  });
});

// Deregister user
app.delete("/users", (req, res) => {
  const userIdFromBody = req.body.userId; // Отримуємо userId з тіла запиту

  // Check userId
  if (!userIdFromBody) {
    return res.status(400).json({ message: "Missing userId in request body." });
  }

  // Знаходимо індекс користувача за userId
  const userIndex = users.findIndex((u) => u.id === userIdFromBody);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.json({ message: "User has been removed." });
  } else {
    res.status(404).json({ message: "User not found." });
  }
});

// Default welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the world of movies!");
});

// Documentation route
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

// Error-Handling Middleware
/*app.get("/cause-error", (req, res, next) => {
  const err = new Error("This is a simulated error!");
  err.status = 500; //
  next(err); // Передаємо помилку в middleware для обробки помилок
});*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
// Start the server
app.listen(8080, () => {
  console.log("your app is listening on port 8080.");
});
