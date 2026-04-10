const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Dataset: Static Array of Game Characters
let characters = [
    { id: 1, name: "Invoker", role: "Nuker", difficulty: "Hard" },
    { id: 2, name: "Jett", role: "Duelist", difficulty: "Medium" },
    { id: 3, name: "Crystal Maiden", role: "Support", difficulty: "Easy" },
    { id: 4, name: "Omen", role: "Controller", difficulty: "Medium" }
];

// --- 10 UNIQUE API ENDPOINTS ---

// 1. GET all characters
app.get('/characters', (req, res) => {
    res.status(200).json(characters);
});

// 2. GET character by ID
app.get('/characters/:id', (req, res) => {
    const char = characters.find(c => c.id === parseInt(req.params.id));
    if (!char) return res.status(404).json({ message: "Character not found" });
    res.status(200).json(char);
});

// 3. POST a new character
app.post('/characters', (req, res) => {
    const { name, role, difficulty } = req.body;
    if (!name || !role || !difficulty) {
        return res.status(400).json({ message: "Bad Request: Missing data" });
    }
    const newChar = {
        id: characters.length ? characters[characters.length - 1].id + 1 : 1,
        name, role, difficulty
    };
    characters.push(newChar);
    res.status(201).json(newChar);
});

// 4. PUT (update) an existing character
app.put('/characters/:id', (req, res) => {
    const char = characters.find(c => c.id === parseInt(req.params.id));
    if (!char) return res.status(404).json({ message: "Character not found" });

    const { name, role, difficulty } = req.body;
    if (name) char.name = name;
    if (role) char.role = role;
    if (difficulty) char.difficulty = difficulty;

    res.status(200).json(char);
});

// 5. DELETE a character
app.delete('/characters/:id', (req, res) => {
    const index = characters.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Character not found" });

    const deleted = characters.splice(index, 1);
    res.status(200).json({ message: "Character deleted", character: deleted[0] });
});

// 6. GET characters by role
app.get('/characters/role/:role', (req, res) => {
    const filtered = characters.filter(c => c.role.toLowerCase() === req.params.role.toLowerCase());
    res.status(200).json(filtered);
});

// 7. GET top characters (returns first 2 for demonstration)
app.get('/top-characters', (req, res) => {
    res.status(200).json(characters.slice(0, 2));
});

// 8. GET search by name
app.get('/search', (req, res) => {
    const query = req.query.name;
    if (!query) return res.status(400).json({ message: "Missing search query parameter" });
    
    const results = characters.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
    res.status(200).json(results);
});

// 9. GET system stats
app.get('/stats', (req, res) => {
    res.status(200).json({ totalCharacters: characters.length });
});

// 10. GET a random character
app.get('/random', (req, res) => {
    if (characters.length === 0) return res.status(404).json({ message: "No characters available" });
    const randomIndex = Math.floor(Math.random() * characters.length);
    res.status(200).json(characters[randomIndex]);
});

// --- START THE SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running! Open http://localhost:${PORT}/characters in your browser.`);
});