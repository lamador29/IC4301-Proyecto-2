let searchMode = 'page'; // Default search mode

// Sets the search mode based on user selection
function setSearchMode(mode) {
    searchMode = mode;

    // Toggle the active class for buttons searchByTogetherWords
    document.getElementById("searchByWords").classList.toggle('active', mode === 'words');
    document.getElementById("searchByPage").classList.toggle('active', mode === 'page');
    document.getElementById("searchByTogetherWords").classList.toggle('active', mode === 'together');

    document.getElementById("searchInput").placeholder = mode === 'words'
        ? "Ingrese palabras a buscar"
        : "Ingrese la página a buscar";
}

function performSearch() {
    const query = document.getElementById("searchInput").value.trim();

    stringSearchTerm = document.getElementById("searchInput").value.toLowerCase();

    if (searchMode === 'words') {
        searchTerm = stringSearchTerm;
        fetchWords(searchTerm);
    } else if (stringSearchTerm === '') {
        fetchSimplePages();
    } else if (searchMode === 'together') {
        searchTerm = formatForInClause(stringSearchTerm);
        searchTogetherTerm = formatForTogetherInClause(stringSearchTerm);
        if (searchTogetherTerm !== '') {
            fetchTogetherPages(searchTerm, searchTogetherTerm);
        } else {
            fetchPages(searchTerm);
        }
    } else {
        searchTerm = formatForInClause(stringSearchTerm);
        fetchPages(searchTerm);
    }
}

async function fetchSimplePages() {
    document.getElementById("resultsList").innerHTML = "Realizando consulta...";

    try {
        const response = await fetch('/main/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const pages = await response.json();

        document.getElementById("resultsList").innerHTML = "";
        pages.forEach(page => {
            const pageItem = document.createElement('a');

            pageItem.href = "#";
            pageItem.classList.add("list-group-item", "list-group-item-action");
            pageItem.textContent = capitalizeText(page.page);

            const subtitle = document.createElement('p');
            subtitle.classList.add("table-subtitle");
            subtitle.textContent = page.url;

            pageItem.appendChild(subtitle);
            document.getElementById("resultsList").appendChild(pageItem);

            pageItem.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('pageName', page.page);   
                window.location.href = '/pageDetail.html';  
            });
        });
    } catch (error) {
        document.getElementById("resultsList").innerHTML = "Error al realizar consulta";
        console.error('Error fetching pages:', error);
    }
}

async function fetchTogetherPages(searchTerm, searchTogetherTerm) {
    document.getElementById("resultsList").innerHTML = "Realizando consulta...";

    try {
        const response = await fetch('/main/getTogetherPages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchTerm, searchTogetherTerm })
        });

        const pages = await response.json();

        document.getElementById("resultsList").innerHTML = "";
        pages.forEach(page => {
            const pageItem = document.createElement('a');

            pageItem.href = "#";
            pageItem.classList.add("list-group-item", "list-group-item-action");
            pageItem.textContent = capitalizeText(page.page);

            const subtitle = document.createElement('p');
            subtitle.classList.add("table-subtitle");
            subtitle.textContent = page.url;

            pageItem.appendChild(subtitle);
            document.getElementById("resultsList").appendChild(pageItem);

            pageItem.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('pageName', page.page);   
                window.location.href = '/pageDetail.html';  
            });
        });
    } catch (error) {
        document.getElementById("resultsList").innerHTML = "Error al realizar consulta";
        console.error('Error fetching pages:', error);
    }
}

async function fetchPages(searchTerm) {
    document.getElementById("resultsList").innerHTML = "Realizando consulta...";

    try {
        const response = await fetch('/main/getPages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchTerm })
        });

        const pages = await response.json();

        document.getElementById("resultsList").innerHTML = "";
        pages.forEach(page => {
            const pageItem = document.createElement('a');

            pageItem.href = "#";
            pageItem.classList.add("list-group-item", "list-group-item-action");
            pageItem.textContent = capitalizeText(page.page);

            const subtitle = document.createElement('p');
            subtitle.classList.add("table-subtitle");
            subtitle.textContent = page.url;

            pageItem.appendChild(subtitle);
            document.getElementById("resultsList").appendChild(pageItem);

            pageItem.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('pageName', page.page);   
                window.location.href = '/pageDetail.html';  
            });
        });
    } catch (error) {
        document.getElementById("resultsList").innerHTML = "Error al realizar consulta";
        console.error('Error fetching pages:', error);
    }
}

async function fetchWords(searchTerm) {
    document.getElementById("resultsList").innerHTML = "Realizando consulta...";

    try {
        const response = await fetch('/main/getWords', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ searchTerm })
        });

        const words = await response.json();

        document.getElementById("resultsList").innerHTML = "";
        words.forEach(word => {
            const wordItem = document.createElement('a');

            wordItem.href = "#";
            wordItem.classList.add("list-group-item", "list-group-item-action");
            wordItem.textContent = word.word;

            document.getElementById("resultsList").appendChild(wordItem);

            wordItem.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('wordDetail', word.word);
                window.location.href = '/wordDetail.html';
            });
        });
    } catch (error) {
        console.error('Error fetching words:', error);
    }
}

function formatForInClause(str) {
    return str.split(' ').map(word => `'${word}'`).join(', ');
}

function formatForTogetherInClause(str) {
    const words = str.split(' ');
    const wordsToProcess = words.slice(1);
    if (wordsToProcess.length === 0 || wordsToProcess.every(word => word === '')) {
        return '';
    }
    return wordsToProcess.map(word => `'${word}'`).join(', ');
}

function capitalizeText(text) {
    return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Expose functions globally
window.setSearchMode = setSearchMode;
window.performSearch = performSearch;