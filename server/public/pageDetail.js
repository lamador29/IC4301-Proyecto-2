localStorage.setItem('pageUrl', 'https://www.example.com');

async function fetchPage() {
    document.getElementById("page-title").innerHTML = "";
    document.getElementById("page-url").innerHTML = "";
    document.getElementById("total-words").innerHTML = "";
    document.getElementById("word-percentage-table").innerHTML = "";
    document.getElementById("unique-words-table").innerHTML = "";
    document.getElementById("total-words-table").innerHTML = "";

    const url = localStorage.getItem('pageUrl');
    //const url = "https://www.example.com";

    try {
        const response = await fetch('/main/getPageInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        const { page, words } = await response.json();

        const pageInfo = Array.isArray(page) && page.length > 0 ? page[0] : null;
        document.getElementById("page-title").innerHTML = pageInfo.title;
        document.getElementById("page-url").innerHTML = pageInfo.url;
        document.getElementById("total-words").innerHTML = pageInfo.wordTotal;


        // Word Percentage Table
        words.forEach(word => {
            const row = document.createElement('tr');
            const wordCell = document.createElement('td');
            const percentageCell = document.createElement('td');

            wordCell.textContent = word.word;

            const totalWords = pageInfo.wordTotal || 0;
            const wordAmount = word.amount || 0;
            console.log(totalWords);
            console.log(wordAmount);
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

fetchPage();