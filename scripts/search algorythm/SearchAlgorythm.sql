USE proyecto1;


WITH filteredwords AS (
    SELECT 
        page,
        amount * 
        (CASE tag 
            WHEN 'p' THEN 1
            WHEN 'h1' THEN 10 
            ELSE 5
         END) AS score
    FROM 
        wordspertag
    WHERE 
        word = 'costa' OR word = 'rica'
),

filteredwordstogether AS (
    SELECT 
        lwtpt.page,
        lwtpt.amount * 
        (CASE lwtpt.tag 
            WHEN 'p' THEN 2
            WHEN 'h1' THEN 20 
            ELSE 10
         END) AS score
    FROM 
        lesswordstogetherpertag AS lwtpt
    JOIN 
        filteredwords AS fw ON fw.page = lwtpt.page
    WHERE
        lwtpt.word2 = 'rica'
),

result AS (
    SELECT * FROM filteredwords
    UNION ALL
    SELECT * FROM filteredwordstogether
)

SELECT 
    page,
    SUM(score) AS searchscore
FROM 
    result
GROUP BY 
    page
ORDER BY 
    searchscore DESC
LIMIT 100;