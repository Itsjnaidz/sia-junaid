const API_URL = 'http://localhost:3000';

// Fetch stats and characters when the page loads
async function loadData() {
    fetchStats();
    fetchCharacters();
}

// Get the total number of characters
async function fetchStats() {
    const res = await fetch(`${API_URL}/stats`);
    const data = await res.json();
    document.getElementById('statsBox').innerHTML = `<p><strong>Total Characters in System:</strong> ${data.totalCharacters}</p>`;
}

// Get all characters and display them
async function fetchCharacters() {
    const res = await fetch(`${API_URL}/characters`);
    const data = await res.json();
    const list = document.getElementById('characterList');
    list.innerHTML = ''; // Clear loading text
    
    data.forEach(char => {
        list.innerHTML += `
            <div class="card">
                <strong>${char.name}</strong> <br>
                Role: ${char.role} | Difficulty: ${char.difficulty}
            </div>
        `;
    });
}

// Add a new character via the form
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page from refreshing
    
    const newChar = {
        name: document.getElementById('name').value,
        role: document.getElementById('role').value,
        difficulty: document.getElementById('difficulty').value
    };

    const res = await fetch(`${API_URL}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChar)
    });

    if (res.status === 201) {
        e.target.reset(); // Clear the text boxes
        loadData();       // Refresh the list immediately
    }
});

// Start the app!
loadData();