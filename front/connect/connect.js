const router = require("express").Router();
const query = require("./db.js");
const session = require("express-session");
const argon2 = require("argon2");
const path = require("path");

router.use(
  session({
    secret: process.env.SESSION_SECRET || "a_very_secure_secret_key", // Change this in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 60000 }, // à ajuster selon les besoins
  })
);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, "static")));

// Route: Home
router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/connect.html"));
});

// Route: Authentication
router.post("/auth", async function (req, res) {
  let email = req.body.email;
  let password = req.body.password;

  if (email && password) {
    try {
      // Get the user by email
      const userQuery = "SELECT * FROM users WHERE email = $1";
      const result = await query(userQuery, [email]);

      if (result.length > 0) {
        const user = result[0];
        const hash = await argon2.hash(password)

        // Compare the provided password with the stored hash
        const isPasswordValid = await argon2.verify(user.password, hash);

        if (isPasswordValid) {
          req.session.loggedin = true;
          req.session.email = email;
          return res.redirect("/blog");
        } else {
          return res.status(400).send("Incorrect email and/or Password!");
        }
      } else {
        return res.status(400).send("Incorrect email and/or Password!");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      return res
        .status(500).send("An error occurred during authentication. Please try again later.");
    }
  } else {
    return res.status(400).send("Please enter both email and Password!");
  }
});

// Route: Blog (Requires authentication)
router.get("/blog", function (req, res) {
  if (req.session.loggedin) {
    return res.send("Welcome back, " + req.session.email + "!");
  } else {
    return res.status(401).send("Please login to view this page!");
  }
});

// Start the server
const PORT = process.env.PORT || 8080;
router.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = router;