const router = require("express").Router();
const query = require("./db.js");
const argon2 = require("argon2");

// Créer un nouvel utilisateur
router.post("/", async (req, res) => {
    const { username, email, password } = req.body;

    // Vérifications des données d'entrée
    if (!username) {
        return res.status(400).json({ message: "Le nom d'utilisateur est requis." });
    }
    if (!email) {
        return res.status(400).json({ message: "L'email est requis." });
    }
    if (!password) {
        return res.status(400).json({ message: "Le mot de passe est requis." });
    }
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères, avec une majuscule, une minuscule et un chiffre." });
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.status(400).json({ message: "Le format de l'email est invalide." });
    }

    try {
        // Vérifier si l'email existe déjà
        const userCheck = await query("SELECT * FROM users WHERE email = $1", [email]);

        if (userCheck.rowCount > 0) {
            return res.status(409).json({ message: "L'utilisateur avec cet email existe déjà." });
        }

        // Hash du mot de passe
        const hash = await argon2.hash(password);

        // Insertion du nouvel utilisateur
        const result = await query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hash]
        );

        // Retourner l'utilisateur créé
        const newUser = result.rows[0];
        return res.status(201).json({ message: "Utilisateur créé avec succès.", user: newUser });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return res.status(500).json({ message: "Une erreur est survenue lors de l'inscription. Veuillez réessayer plus tard." });
    }
});

async function signup(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
      const response = await fetch("/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
          document.getElementById("responseMessage").textContent = data.message;
      } else {
          document.getElementById("responseMessage").textContent = data.message || "Erreur lors de l'inscription.";
      }
  } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      document.getElementById("responseMessage").textContent = "Une erreur est survenue lors de l'inscription.";
  }
};

module.exports = router;
