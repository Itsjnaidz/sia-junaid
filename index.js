const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Dataset: Static Array of Students
let students = [
    { id: 1, name: "Salman Mutalib", yearLevel: "2" },
    { id: 2, name: "John Doe", yearLevel: "1" },
    { id: 3, name: "Jane Smith", yearLevel: "3" }
];

// --- 10 UNIQUE API ENDPOINTS (Updated for Students) ---

// 1. GET all students
app.get('/students', (req, res) => {
    res.status(200).json(students);
});

// 2. GET student by ID
app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
});

// 3. POST a new student
app.post('/students', (req, res) => {
    const { name, yearLevel } = req.body;
    // This is where your error was! We now check for yearLevel instead of role/difficulty
    if (!name || !yearLevel) {
        return res.status(400).json({ message: "Bad Request: Missing name or year level" });
    }
    const newStudent = {
        id: students.length ? students[students.length - 1].id + 1 : 1,
        name, 
        yearLevel
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// 4. PUT (update) an existing student
app.put('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).json({ message: "Student not found" });

    const { name, yearLevel } = req.body;
    if (name) student.name = name;
    if (yearLevel) student.yearLevel = yearLevel;

    res.status(200).json(student);
});

// 5. DELETE a student
app.delete('/students/:id', (req, res) => {
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Student not found" });

    const deleted = students.splice(index, 1);
    res.status(200).json({ message: "Student deleted", student: deleted[0] });
});

// 6. GET students by year level
app.get('/students/year/:yearLevel', (req, res) => {
    const filtered = students.filter(s => s.yearLevel === req.params.yearLevel);
    res.status(200).json(filtered);
});

// 7. GET top/recent students (returns first 2 for demonstration)
app.get('/top-students', (req, res) => {
    res.status(200).json(students.slice(0, 2));
});

// 8. GET search by name
app.get('/search', (req, res) => {
    const query = req.query.name;
    if (!query) return res.status(400).json({ message: "Missing search query parameter" });
    
    const results = students.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
    res.status(200).json(results);
});

// 9. GET system stats
app.get('/stats', (req, res) => {
    res.status(200).json({ totalStudents: students.length });
});

// 10. GET a random student
app.get('/random', (req, res) => {
    if (students.length === 0) return res.status(404).json({ message: "No students available" });
    const randomIndex = Math.floor(Math.random() * students.length);
    res.status(200).json(students[randomIndex]);
});

// --- PORT SETUP FOR RENDER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});