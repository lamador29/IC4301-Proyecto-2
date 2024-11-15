USE proyecto1;


SELECT 
    w.page,
    p.url,
    p.wordTotal,
    w.amount * 
    (CASE w.tag 
        WHEN 'p' THEN 1
        WHEN 'h1' THEN 10 
        ELSE 5
     END) AS score
FROM 
    wordspertag AS w
INNER JOIN 
    pages AS p
ON 
    w.page = p.title
WHERE 
    w.word IN ('costa', 'rica')
ORDER BY 
    score DESC
LIMIT 100;