
async function fetchWord() {
    document.getElementById("page-title").innerHTML = "";
    document.getElementById("total-pages").innerHTML = "Cargando...";
    document.getElementById("word-table").innerHTML = "Realizando consulta...";
    document.getElementById("page-table").innerHTML = "Realizando consulta...";
    document.getElementById("page-tag-table").innerHTML = "Realizando consulta...";

    const word = localStorage.getItem('wordDetail');

    try {
        document.getElementById("page-title").innerHTML = capitalizeText(word);

        const wikiResponse = await fetch('/main/getWikipedia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        const response = await fetch('/main/getWordInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word })
        });

        const { wordDetails } = await response.json();
        const { wikipedia } = await wikiResponse.json();

        document.getElementById("total-pages").innerHTML = wordDetails.length + " sitios distintos";
        document.getElementById("word-table").innerHTML = "";
        document.getElementById("page-table").innerHTML = "";
        document.getElementById("page-tag-table").innerHTML = "";

        const totalAmountOfWord = wordDetails.reduce((sum, { amount }) => sum + amount, 0);
        const wiki = wikipedia[0];

        const row = document.createElement('tr');
        const amountCell = document.createElement('td');
        const wikiCell = document.createElement('td');
        amountCell.textContent = totalAmountOfWord;
        wikiCell.textContent = (totalAmountOfWord * 100 / wiki.amountWords) + "%";
        row.appendChild(amountCell);
        row.appendChild(wikiCell);
        document.getElementById("word-table").appendChild(row);

        const orderedTotal = getTotal100(wordDetails);
        orderedTotal.forEach(wordDetail => {
            const row = document.createElement('tr');
            const wordCell = document.createElement('td');
            const amountCell = document.createElement('td');

            amountCell.textContent = wordDetail.totalAmount;

            const pageLink = document.createElement('a');
            pageLink.href = "#";
            pageLink.textContent = capitalizeText(wordDetail.page);
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('pageName', wordDetail.page);  
                window.location.href = '/pageDetail.html';  
            });
            wordCell.appendChild(pageLink);

            row.appendChild(wordCell);
            row.appendChild(amountCell);
            document.getElementById("page-table").appendChild(row);
        });

        const top100 = getTop100(wordDetails);
        top100.forEach(wordDetail => {
            const row = document.createElement('tr');
            const wordCell = document.createElement('td');
            const tagCell = document.createElement('td');
            const amountCell = document.createElement('td');

            wordCell.textContent = capitalizeText(wordDetail.page);
            tagCell.textContent = capitalizeText(wordDetail.tag);
            amountCell.textContent = wordDetail.amount;

            row.appendChild(wordCell);
            row.appendChild(tagCell);
            row.appendChild(amountCell);
            document.getElementById("page-tag-table").appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching word:', error);
    }
}

function getTotal100(words) {
    const result = Object.values(
        words.reduce((acc, { page, amount }) => {
          if (!acc[page]) {
            acc[page] = { page, totalAmount: 0 };
          }
          acc[page].totalAmount += amount;
          return acc;
        }, {})
      ).map(({ page, totalAmount }) => ({ page, totalAmount }));

    return result.slice(0, 100);
}

function getTop100(words) {
    return words.slice(0, 100);
}

function capitalizeText(text) {
    return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

fetchWord()