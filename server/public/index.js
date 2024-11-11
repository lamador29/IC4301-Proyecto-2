let searchMode = 'words'; // Default search mode

// Sets the search mode based on user selection
function setSearchMode(mode) {
    searchMode = mode;

    // Toggle the active class for buttons
    document.getElementById("searchByWords").classList.toggle('active', mode === 'words');
    document.getElementById("searchByPage").classList.toggle('active', mode === 'page');
    document.getElementById("searchInput").placeholder = mode === 'words'
        ? "Ingrese palabras a buscar" 
        : "Ingrese la página a buscar";
}

// Performs search based on mode
function performSearch() {
    const query = document.getElementById("searchInput").value.trim();
    document.getElementById("resultsList").innerHTML = ""; // Clear previous results

    // Sample results based on mode
    const sampleResults = searchMode === 'words'
        ? ['Resultado de palabra 1', 'Resultado de palabra 2', 'Resultado de palabra 3']
        : ['Página encontrada: Página 1', 'Página encontrada: Página 2'];

    sampleResults.forEach(result => {
        const resultItem = document.createElement('a');
        resultItem.href = "#"; // Modify to actual link if needed
        resultItem.classList.add("list-group-item", "list-group-item-action");
        resultItem.textContent = result;
        document.getElementById("resultsList").appendChild(resultItem);
    });
}

// Fetches and displays tables from the backend
async function fetchTables() {
    document.getElementById("resultsList").innerHTML = ""; // Clear previous results

    try {
        // Make a POST request instead of GET
        const response = await fetch('/main/showTables', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // Send an empty body if no specific data is needed
        });

        const tables = await response.json();

        // Display each table in the results list
        tables.forEach(table => {
            const tableItem = document.createElement('a');
            tableItem.href = "#";
            tableItem.classList.add("list-group-item", "list-group-item-action");
            tableItem.textContent = table;
            document.getElementById("resultsList").appendChild(tableItem);
        });
    } catch (error) {
        console.error('Error fetching tables:', error);
    }
}

// Expose functions globally
window.setSearchMode = setSearchMode;
window.performSearch = performSearch;
window.fetchTables = fetchTables;
