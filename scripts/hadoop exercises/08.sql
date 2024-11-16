USE proyecto1;
/* Filas afectadas: 0  Filas encontradas: 100 000  Advertencias: 0  Duración para 2 consultas: 00:14:16.6 (+ 0,203 seg. red) */

WITH page_totals AS (
    SELECT page, SUM(amount) AS total_words
    FROM wordspertag
    GROUP BY page
)
SELECT wt.word, wt.page, 
       (wt.amount / pt.total_words) * 100 AS percentage
FROM wordspertag wt
JOIN page_totals pt ON wt.page = pt.page
GROUP BY wt.word, wt.page
LIMIT 100000;