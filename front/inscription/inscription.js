const router = require("express").Router();
const query = require("./db.js");

// create a new user
router.post("/", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    if (!username && !email && !password) {
      return res.status(400).send("Aucune donnée fourni");
    } else if (!username) {
      return res.status(400).send("Aucun nom d'utilisateur fourni");
    } else if (!email) {
      return res.status(400).send("Aucun email fourni");
    } else if (!password) {
      return res.status(400).send("Aucun mot de passe fourni");
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
      return res.status(400).send("Mot de passe au mauvais format")
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).send("Email au mauvais format")
    } else {
      try {
        const result = await query(
            "SELECT * FROM users WHERE email = $1",
            [email]
          );
          if (result.rowCount === 1) {
            res.status(409).send("L'utilisateur existe déjà.");
          } else {
            const hash = await argon2.hash("password");
            const result2 = await query(
              "INSERT INTO users(email, password) VALUES ($1, $2)",
              [email, hash]
            );
            const user = result2.rows[0];
            res.status(201).send(user);
          }
      } catch (err) {
        //...
      }
    }
  });

  module.exports = router;