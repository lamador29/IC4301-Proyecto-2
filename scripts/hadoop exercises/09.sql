USE proyecto1;
/* */

WITH top10 AS (
    SELECT 
        page, 
        tag, 
        COUNT(DISTINCT word) AS distinct_words_count,
        ROW_NUMBER() OVER (PARTITION BY page ORDER BY COUNT(DISTINCT word) DESC) AS rank
    FROM 
        wordspertag
    GROUP BY 
        page, tag
)
SELECT 
    page, 
    tag, 
    distinct_words_count
FROM 
    top10
WHERE 
    rank <= 10
ORDER BY 
    page, rank;