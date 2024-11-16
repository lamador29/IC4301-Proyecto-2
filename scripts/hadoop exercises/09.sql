USE proyecto1;
/* Filas afectadas: 0  Filas encontradas: 10  Advertencias: 0  Duración para 2 consultas: 00:01:12.2 */

SELECT page, tag, COUNT(DISTINCT word) AS distinct_words_count
FROM wordspertag
GROUP BY page, tag
ORDER BY distinct_words_count DESC
LIMIT 10;