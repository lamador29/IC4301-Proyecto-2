async function fetchPage() {
    document.getElementById("page-title").innerHTML = "";
    document.getElementById("page-url").innerHTML = "";
    document.getElementById("total-words").innerHTML = "";
    document.getElementById("word-percentage-table").innerHTML = "";
    document.getElementById("unique-words-table").innerHTML = "";
    document.getElementById("total-words-table").innerHTML = "";

    const name = localStorage.getItem('pageName');

    try {
        const response = await fetch('/main/getPageInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });

        const { page, words } = await response.json();

        const pageInfo = Array.isArray(page) && page.length > 0 ? page[0] : null;
        document.getElementById("page-title").innerHTML = capitalizeText(pageInfo.title);
        const pageUrlElement = document.getElementById("page-url");
        pageUrlElement.href = pageInfo.url; 
        pageUrlElement.textContent = pageInfo.url;
        document.getElementById("total-words").innerHTML = pageInfo.wordTotal;

        // Word Percentage Table
        const orderedWords = combinateOrderedWords(words);
        orderedWords.forEach(word => {
            const row = document.createElement('tr');
            const wordCell = document.createElement('td');
            const percentageCell = document.createElement('td');

            // Crea un enlace para la palabra que redirige a wordDetail.html
            const wordLink = document.createElement('a');
            wordLink.href = "#";
            wordLink.textContent = word.word;
            wordLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.setItem('wordDetail', word.word);  // Guarda la palabra en localStorage
                window.location.href = '/wordDetail.html';  // Redirige a wordDetail.html
            });

            // Añade el enlace a la celda de palabra
            wordCell.appendChild(wordLink);

            // Calcula el porcentaje y lo asigna a la celda de porcentaje
            const totalWords = pageInfo.wordTotal || 0;
            const wordAmount = word.amount || 0;
            const percentage = totalWords > 0 ? ((wordAmount / totalWords) * 100).toFixed(2) + "%" : "-%";
            percentageCell.textContent = percentage;

            row.appendChild(wordCell);
            row.appendChild(percentageCell);
            document.getElementById("word-percentage-table").appendChild(row);
        });

        // Unique Words by Tag (Top 10)
        const uniqueWordsData = getUniqueWordsData(words);
        uniqueWordsData.forEach(tagData => {
            const row = document.createElement('tr');
            const tagCell = document.createElement('td');
            const uniqueWordCountCell = document.createElement('td');

            tagCell.textContent = tagData.tag;
            uniqueWordCountCell.textContent = tagData.uniqueWordCount;

            row.appendChild(tagCell);
            row.appendChild(uniqueWordCountCell);
            document.getElementById("unique-words-table").appendChild(row);
        });

        // Total Words by Tag (Top 10)
        const totalWordsData = getTotalWordsData(words);
        totalWordsData.forEach(tagData => {
            const row = document.createElement('tr');
            const tagCell = document.createElement('td');
            const totalWordCountCell = document.createElement('td');

            tagCell.textContent = tagData.tag;
            totalWordCountCell.textContent = tagData.totalWordCount;

            row.appendChild(tagCell);
            row.appendChild(totalWordCountCell);
            document.getElementById("total-words-table").appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching page:', error);
    }
}

function getUniqueWordsData(words) {
    // Process words to get unique word counts by tag
    const tagUniqueWords = {};
    words.forEach(word => {
        if (!tagUniqueWords[word.tag]) tagUniqueWords[word.tag] = new Set();
        tagUniqueWords[word.tag].add(word.word);
    });
    return Object.entries(tagUniqueWords)
        .map(([tag, uniqueWords]) => ({ tag, uniqueWordCount: uniqueWords.size }))
        .sort((a, b) => b.uniqueWordCount - a.uniqueWordCount)
        .slice(0, 10);
}

function getOrderedWords(words) {
    // Sort the words array by the amount in descending order
    const sortedWords = words.sort((a, b) => b.amount - a.amount);
    return sortedWords.slice(0, 50);
}

function combinateOrderedWords(words) {
    const wordCounts = {};

    // Accumulate amounts of each unique word, ignoring tags
    words.forEach(item => {
        const word = item.word;
        if (wordCounts[word]) {
            wordCounts[word].amount += item.amount;
        } else {
            wordCounts[word] = { word: word, amount: item.amount };
        }
    });

    return getOrderedWords(Object.values(wordCounts));
}

function getTotalWordsData(words) {
    // Process words to get total word counts by tag
    const tagTotalWords = {};
    words.forEach(word => {
        if (!tagTotalWords[word.tag]) tagTotalWords[word.tag] = 0;
        tagTotalWords[word.tag] += word.amount;
    });
    return Object.entries(tagTotalWords)
        .map(([tag, totalWordCount]) => ({ tag, totalWordCount }))
        .sort((a, b) => b.totalWordCount - a.totalWordCount)
        .slice(0, 10);
}

function capitalizeText(text) {
    return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

fetchPage();
