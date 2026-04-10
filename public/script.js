// Change this back to your live Render link!
const API_URL = 'https://system-integration-api.onrender.com'; 

// 1. Fetch and display data ONLY when the button is clicked
document.getElementById('displayBtn').addEventListener('click', async () => {
    const list = document.getElementById('studentList');
    list.innerHTML = 'Loading students...'; 

    try {
        // NOTE: Make sure your backend index.js has a /students endpoint now!
        const res = await fetch(`${API_URL}/students`); 
        const data = await res.json();
        
        list.innerHTML = ''; // Clear loading text
        
        // Display each student
        data.forEach(student => {
            list.innerHTML += `
                <div>${student.name} - Year Level: ${student.yearLevel}</div>
            `;
        });
    } catch (err) {
        list.innerHTML = "Error loading data.";
        console.error(err);
    }
});

// 2. Add a new student via the form
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const newStudent = {
        name: document.getElementById('name').value,
        yearLevel: document.getElementById('yearLevel').value
    };

    try {
        const res = await fetch(`${API_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });

        if (res.status === 201) {
            e.target.reset(); // Clear the text boxes
            alert("Student added! Click 'Display Students' to refresh."); 
        }
    } catch (err) {
        console.error("Error adding student:", err);
    }
});