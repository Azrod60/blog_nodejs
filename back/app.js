const express = require("express");
const bodyParser = require("body-parser");
const query = require("./db.js");
const inscriptionRouter = require('../front/inscription/inscription.js');

const router = express();
const PORT = process.env.PORT || 8080;

// // middleware bodyparser
// router.use(bodyParser.json());
// router.use('/users', inscriptionRouter);

router.get("/", (req, res) => {
  res.send("Hello world");
});

// // get all users
// router.get("/users", async (req, res) => {
//   const result = await query("SELECT * FROM users");
//   if (result.rowCount === 0) {
//     res.send("Ancun utilisateur trouvé");
//   } else {
//     res.send(result.rows);
//   }
// });
// // get an user
// router.get("/users/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   if (isNaN(id)) {
//     res.status(400).send("Id params required");
//   } else {
//     const user = users[id];
//     if (user === undefined) {
//       res.status(404).send(`Aucun utilisateur possedant l\'id: ${id}`);
//     } else {
//       const result = await query("SELECT * FROM users WHERE id = '$1'");
//       res.send(result);
//     }
//   }
// });

// // update an user
// router.put("/users/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const username = req.body.username;
//   const email = req.body.email;
//   const password = req.body.password;
//   const result = await query("SELECT * FROM users WHERE id = $1", [id]);
//   if (result.rowCount === 0) {
//     res.status(404).send(`Aucun utilisateur existant sur l'id: ${id}`);
//   } else if (!username && !email && !password) {
//     res.status(400).send("Aucun body fourni");
//   } else if (!username) {
//     res.status(400).send("Aucun nom d'utilisateur fourni");
//   } else if (!email) {
//     res.status(400).send("Aucun email fourni");
//   } else if (!password) {
//     res.status(400).send("Aucun mot de passe fourni");
//   } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
//     return res.status(400).send("Mot de passe au mauvais format")
//   } else {
//     const result2 = await query(
//       "UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 ",
//       [username, email, password, id]
//     );
//     const user = result2.rows[1];
//     res.status(200).send(user);
//   }
// });
// // delete an user
// router.delete("/users/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const result = await query("SELECT * FROM users WHERE id = $1", [id]);
//   if (isNaN(id)) {
//     res.status(400).send("Id params required");
//   } else if (result.rowCount === 0) {
//     res.status(404).send(`Aucun utilisateur existant sur l'id: ${id}`);
//   } else {
//     const result2 = await query("DELETE FROM users WHERE id = $1", [id]);
//     const user = result2.rows[0];
//     res.status(200).send(user);
//   }
// });

// // get all posts
// router.get("/posts", async (req, res) => {
//   const result = await query("SELECT * FROM posts");
//   if (result.rowCount === 0) {
//     res.status(404).send("Ancun article trouvé");
//   } else {
//     res.send(result.rows);
//   }
// });

// // get a post
// router.get("/posts/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   if (isNaN(id)) {
//     res.status(400).send("Id params required");
//   } else {
//     const post = posts[id];
//     if (post === undefined) {
//       res.status(404).send(`Aucun article possedant l\'id: ${id}`);
//     } else {
//       const result = await query("SELECT * FROM posts WHERE id = '$1'");
//       res.send(result);
//     }
//   }
// });

// // create a new post
// router.post("/posts", async (req, res) => {
//   const title = req.body.titre;
//   const body = req.body.body;
//   const image = req.body.image;
//   if (!title && !body && !image) {
//     res.status(400).send("Aucune contenu fourni");
//   } else if (!title) {
//     res.status(400).send("Aucun titre fourni");
//   } else if (!body) {
//     res.status(400).send("Aucun texte fourni");
//   } else if (!image) {
//     res.status(400).send("Aucune image fourni");
//   } else {
//     const result = await query(
//       "SELECT * FROM users WHERE title = $1 AND body = $2 AND image = $3",
//       [title, body, image]
//     );
//     if (result.rowCount === 1) {
//       res.status(409).send("L'article existe déjà.");
//     } else {
//       const result2 = await query(
//         "INSERT INTO posts (title, body, image) VALUES ($1, $2, $3)",
//         [title, body, image]
//       );
//       const user = result2.rows[0];
//       res.status(201).send(user);
//     }
//   }
// });

// // update a post
// router.put("/posts/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const title = req.body.titre;
//   const body = req.body.body;
//   const image = req.body.image;
//   const result = await query("SELECT * FROM posts WHERE id = $1", [id]);
//   if (result.rowCount === 0) {
//     res.status(404).send(`Aucun article existant sur l'id: ${id}`);
//   } else if (!title && !body && !image) {
//     res.status(400).send("Aucun contenu fourni");
//   } else if (!title) {
//     res.status(400).send("Aucun titre fourni");
//   } else if (!body) {
//     res.status(400).send("Aucun texte fourni");
//   } else if (!image) {
//     res.status(400).send("Aucune image fourni");
//   } else {
//     const result2 = await query(
//       "UPDATE posts SET title = $1, body = $2, image = $3 WHERE id = $4 ",
//       [title, body, image, id]
//     );
//     const post = result2.rows[1];
//     res.status(200).send(post);
//   }
// });

// // delete a post
// router.delete("/posts/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const result = await query("SELECT * FROM posts WHERE id = $1", [id]);
//   if (isNaN(id)) {
//     res.status(400).send("Id params required");
//   } else if (result.rowCount === 0) {
//     res.status(404).send(`Aucun article existant sur l'id: ${id}`);
//   } else {
//     const result2 = await query("DELETE FROM posts WHERE id = $1", [id]);
//     const post = result2.rows[0];
//     res.status(200).send(post);
//   }
// });

router.listen(PORT, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});
