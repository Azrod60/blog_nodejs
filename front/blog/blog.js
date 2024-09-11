const router = require("express").Router();
const query = require("./db.js");

// get all posts
router.get("/posts", async (req, res) => {
    const result = await query("SELECT * FROM posts");
    if (result.rowCount === 0) {
      res.status(404).send("Ancun article trouvé");
    } else {
      res.send(result.rows);
    }
  });

// create a new post
router.post("/posts", async (req, res) => {
    const title = req.body.titre;
    const body = req.body.body;
    const image = req.body.image;
    if (!title && !body && !image) {
      res.status(400).send("Aucune contenu fourni");
    } else if (!title) {
      res.status(400).send("Aucun titre fourni");
    } else if (!body) {
      res.status(400).send("Aucun texte fourni");
    } else if (!image) {
      res.status(400).send("Aucune image fourni");
    } else {
      const result = await query(
        "SELECT * FROM users WHERE title = $1 AND body = $2 AND image = $3",
        [title, body, image]
      );
      if (result.rowCount === 1) {
        res.status(409).send("L'article existe déjà.");
      } else {
        const result2 = await query(
          "INSERT INTO posts (title, body, image) VALUES ($1, $2, $3)",
          [title, body, image]
        );
        const user = result2.rows[0];
        res.status(201).send(user);
      }
    }
  });