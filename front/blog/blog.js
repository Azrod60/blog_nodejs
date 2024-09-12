const router = require("express").Router();
const query = require("./db.js");

// Récupérer tous les posts
router.get("/posts", async (req, res) => {
    try {
        const result = await query("SELECT * FROM posts");

        // Si aucun article n'a été trouvé
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Aucun article trouvé." });
        }

        // Retourne tous les posts sous forme de JSON
        res.json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la récupération des articles." });
    }
});

// Créer un nouvel article
router.post("/posts", async (req, res) => {
    const { title, body, image } = req.body;

    // Vérification des données d'entrée
    if (!title) {
        return res.status(400).json({ message: "Le titre est requis." });
    }
    if (!body) {
        return res.status(400).json({ message: "Le contenu est requis." });
    }
    if (!image) {
        return res.status(400).json({ message: "L'image est requise." });
    }

    try {
        // Insertion du nouvel article dans la base de données
        const result = await query(
            "INSERT INTO posts (title, body, image) VALUES ($1, $2, $3) RETURNING *",
            [title, body, image]
        );

        // Retourne l'article créé
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la création de l'article :", error);
        res.status(500).json({ message: "Une erreur est survenue lors de la création de l'article." });
    }
});

// Fonction pour récupérer tous les articles et les afficher
async function fetchPosts() {
  try {
      const response = await fetch('/posts');
      const posts = await response.json();

      const postsDiv = document.getElementById('posts');
      postsDiv.innerHTML = ''; // Clear previous content

      posts.forEach(post => {
          const postDiv = document.createElement('div');
          postDiv.innerHTML = `
              <h3>${post.title}</h3>
              <p>${post.body}</p>
              <img src="${post.image}" alt="${post.title}" width="200">
          `;
          postsDiv.appendChild(postDiv);
      });
  } catch (error) {
      console.error("Erreur lors de la récupération des articles:", error);
  }
}

// Fonction pour créer un nouvel article
async function createPost(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const body = document.getElementById('body').value;
  const image = document.getElementById('image').value;

  try {
      const response = await fetch('/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, body, image })
      });

      if (response.ok) {
          alert('Article créé avec succès');
          document.getElementById('postForm').reset(); // Clear the form
          fetchPosts(); // Refresh the post list
      } else {
          const errorData = await response.json();
          alert('Erreur: ' + errorData.message);
      }
  } catch (error) {
      console.error("Erreur lors de la création de l'article:", error);
  }
}

module.exports = router;
