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

function performSearch() {
    const query = document.getElementById("searchInput").value.trim();
    document.getElementById("resultsList").innerHTML = "";

    searchTerm = document.getElementById("searchInput").value.toLowerCase();

    if (searchMode === 'words'){
        fetchWords(searchTerm);
    } else {
        fetchPages(searchTerm);
    }
}

async function fetchPages(searchTerm) {
    document.getElementById("resultsList").innerHTML = "";

    try {
        const response = await fetch('/main/getPages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchTerm })
        });

        const pages = await response.json();

        pages.forEach(page => {
            const pageItem = document.createElement('a');

            pageItem.href = "#";
            pageItem.classList.add("list-group-item", "list-group-item-action");
            pageItem.textContent = page.title;

            const subtitle = document.createElement('p');
            subtitle.classList.add("table-subtitle");
            subtitle.textContent = page.url;

            pageItem.appendChild(subtitle);
            document.getElementById("resultsList").appendChild(pageItem);

            // Evento para guardar el URL en localStorage y redirigir
            pageItem.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('pageUrl', page.url);  // Guarda el URL en localStorage
                window.location.href = '/pageDetail.html';  // Redirige a pageDetail.html
            });
        });
    } catch (error) {
        console.error('Error fetching pages:', error);
    }
}

async function fetchWords(searchTerm) {
    document.getElementById("resultsList").innerHTML = "";

    try {
        const response = await fetch('/main/getWords', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchTerm })
        });

        const words = await response.json();

        words.forEach(word => {
            const wordItem = document.createElement('a');

            wordItem.href = "#";
            wordItem.classList.add("list-group-item", "list-group-item-action");
            wordItem.textContent = word.word;

            document.getElementById("resultsList").appendChild(wordItem);
        });
    } catch (error) {
        console.error('Error fetching words:', error);
    }
}

async function fetchTables() {
    document.getElementById("resultsList").innerHTML = "";

    try {
        const response = await fetch('/main/showTables', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const tables = await response.json();

        // Display each table in the results list
        tables.forEach(table => {
            const tableItem = document.createElement('a');

            tableItem.href = "#";
            tableItem.classList.add("list-group-item", "list-group-item-action");
            tableItem.textContent = table;

            const subtitle = document.createElement('p');
            subtitle.classList.add("table-subtitle");
            subtitle.textContent = `Description of ${table}`;
            tableItem.appendChild(subtitle);

            console.log("Created page item:", pageItem);

            document.getElementById("resultsList").appendChild(tableItem);

            setTimeout(() => {
                pageItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log("Click event triggered!");
                    localStorage.setItem('pageUrl', page.url);
                    window.location.href = '/pageDetail.html';
                });
            }, 0);
        });
    } catch (error) {
        console.error('Error fetching tables:', error);
    }
}

// Expose functions globally
window.setSearchMode = setSearchMode;
window.performSearch = performSearch;
window.fetchTables = fetchTables;