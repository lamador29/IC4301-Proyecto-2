let searchMode = 'page'; // Default search mode

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

            pageItem.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('pageUrl', page.url);  
                window.location.href = '/pageDetail.html';  
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

            // Evento para guardar la palabra en localStorage y redirigir
            wordItem.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('wordDetail', word.word);  // Guarda la palabra en localStorage
                window.location.href = '/wordDetail.html';  // Redirige a wordDetail.html
            });
        });
    } catch (error) {
        console.error('Error fetching words:', error);
    }
}


// Expose functions globally
window.setSearchMode = setSearchMode;
window.performSearch = performSearch;