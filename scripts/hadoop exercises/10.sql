USE proyecto1;
/* */

WITH top10 AS (
    SELECT 
        page, 
        tag, 
        SUM(amount) AS total_text_count,
        ROW_NUMBER() OVER (PARTITION BY page ORDER BY SUM(amount) DESC) AS rank
    FROM 
        wordspertag
    GROUP BY 
        page, tag
)
SELECT 
    page, 
    tag, 
    total_text_count
FROM 
    top10
WHERE 
    rank <= 10
ORDER BY 
    page, rank;