const router = require("express").Router();
const query = require("./db.js");

// get a post
router.get("/posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).send("Id params required");
    } else {
      const post = posts[id];
      if (post === undefined) {
        res.status(404).send(`Aucun article possedant l\'id: ${id}`);
      } else {
        const result = await query("SELECT * FROM posts WHERE id = '$1'");
        res.send(result);
      }
    }
  });