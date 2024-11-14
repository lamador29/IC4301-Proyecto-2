localStorage.setItem('word', 'https://wikipedia.org/wiki/New_York_(state)');

async function fetchPage() {
    document.getElementById("page-title").innerHTML = "";
    document.getElementById("page-url").innerHTML = "";
    document.getElementById("total-words").innerHTML = "";
    document.getElementById("word-percentage-table").innerHTML = "";
    document.getElementById("unique-words-table").innerHTML = "";
    document.getElementById("total-words-table").innerHTML = "";

    const url = localStorage.getItem('pageUrl');

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
        document.getElementById("page-title").innerHTML = capitalizeText(pageInfo.title);
        document.getElementById("page-url").innerHTML = pageInfo.url;
        document.getElementById("total-words").innerHTML = pageInfo.wordTotal;


        // Word Percentage Table
        const orderedWords = combinateOrderedWords(words);
        orderedWords.forEach(word => {
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
        console.error('Error fetching word:', error);
    }
}