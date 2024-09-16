const router = require("express").Router();
const query = require("../back/db.js");
const session = require("express-session");
const argon2 = require("argon2");
const path = require("path");

router.use(
  session({
    secret: process.env.SESSION_SECRET || "a_very_secure_secret_key", // Remplacer par une clé plus sécurisée en production
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // En production, utiliser uniquement des cookies sécurisés
      httpOnly: true,
      maxAge: 3600000, // 1 heure (ajuster selon les besoins)
    },
  })
);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, "static")));

// Route: Page de connexion
router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/connect.html"));
});

// Route: Authentification
router.post("/auth", async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Veuillez entrer l'email et le mot de passe." });
  }

  try {
    // Requête SQL pour récupérer l'utilisateur par email
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const result = await query(userQuery, [email]);

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    const user = result.rows[0];

    // Vérification du mot de passe
    const passwordValid = await argon2.verify(user.password, password);

    if (passwordValid) {
      // Enregistrer la session utilisateur
      req.session.loggedin = true;
      req.session.username = user.username;
      req.session.email = user.email;

      return res.redirect("/blog");
    } else {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }
  } catch (error) {
    console.error("Erreur lors de l'authentification :", error);
    return res.status(500).json({ message: "Une erreur est survenue lors de l'authentification. Veuillez réessayer plus tard." });
  }
});

// Route: Blog (requiert une authentification)
router.get("/blog", (req, res) => {
  if (req.session.loggedin) {
    return res.send(`Bienvenue, ${req.session.username} !`);
  } else {
    return res.status(401).json({ message: "Veuillez vous connecter pour accéder à cette page." });
  }
});

// Lancer le serveur
const PORT = process.env.PORT || 8080;
router.listen(PORT, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});

async function login(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
      const response = await fetch("/auth", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
          window.location.href = "/blog"; // Redirection vers le blog après connexion réussie
      } else {
          document.getElementById("responseMessage").textContent = data.message;
      }
  } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      document.getElementById("responseMessage").textContent = "Une erreur est survenue. Veuillez réessayer.";
  }
};

module.exports = router;