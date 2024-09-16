const router = require("express").Router();
const query = require("../back/db.js");

// Get a specific post by ID
router.get("/posts/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    // Vérification si l'id est valide
    if (isNaN(id)) {
        return res.status(400).send("Invalid post ID format.");
    } try {
        // Récupération du post correspondant à l'id
        const result = await query("SELECT * FROM posts WHERE id = $1", [id]);

        // Si aucun post n'a été trouvé
        if (result.length === 0) {
            return res.status(404).send(`Aucun article correspondant à l'ID ${id}.`);
        }
        // Envoie du post trouvé en réponse JSON
        res.json(result[0]);
    } catch (error) {
        console.error("Database query error:", error);
        return res.status(500).send("Une erreur est survenue lors de la récupération de l'article.");
    }
});

// Récupération de l'ID du post (par exemple depuis l'URL)
const postId = fetch(`/posts/${id}`); 

// Fonction pour récupérer le post depuis le backend
async function fetchPost(postId) {
    try {
        const response = await postId;
        if (!response.ok) {
            throw new Error(`Erreur: ${response.statusText}`);
        }
        const post = await response.json();

        // Mise à jour du contenu de la page
        document.getElementById("post-title").textContent = post.titre;
        document.getElementById("post-image").textContent = post.image;
        document.getElementById("post-content").textContent = post.body;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'article:", error);
    }
}
module.exports = router;
