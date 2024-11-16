USE proyecto1;
/* Filas afectadas: 0  Filas encontradas: 100 000  Advertencias: 0  Duración para 2 consultas: 00:13:40.0 (+ 0,063 seg. red) */

SELECT word, tag, page, SUM(amount) AS word_count_by_page
FROM wordspertag
GROUP BY word, tag, page
LIMIT 100000;