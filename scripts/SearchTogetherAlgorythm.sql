USE proyecto1;


WITH filteredpages AS (
    SELECT 
        w.page,
        p.url,
        p.wordTotal,
        w.amount * 
        (CASE tag 
            WHEN 'p' THEN 1
            WHEN 'h1' THEN 10 
            ELSE 5
         END) AS score
    FROM 
        wordspertag AS w
    INNER JOIN
        pages as p
    ON
        w.page = p.title
    WHERE 
        w.word IN (${searchTerm})
),

filteredwordstogether AS (
    SELECT 
        fp.page,
        fp.url,
        fp.wordTotal,
        lwtpt.amount * 
        (CASE lwtpt.tag 
            WHEN 'p' THEN 2
            WHEN 'h1' THEN 20 
            ELSE 10
         END) AS score
    FROM 
        lesswordstogetherpertag AS lwtpt
    JOIN 
        filteredpages AS fp
    ON
        fp.page = lwtpt.page
    WHERE
        lwtpt.word2 IN (${searchTogetherTerm})
),

result AS (
    SELECT * FROM filteredpages
    UNION ALL
    SELECT * FROM filteredwordstogether
)

SELECT 
    page,
    url,
    wordTotal,
    SUM(score) AS searchscore
FROM 
    result
GROUP BY 
    page
ORDER BY 
    searchscore DESC
LIMIT 100;