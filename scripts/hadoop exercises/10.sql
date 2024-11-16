USE proyecto1;
/* Filas afectadas: 0  Filas encontradas: 10  Advertencias: 0  Duración para 2 consultas: 00:05:59.7 */

SELECT page, tag, SUM(amount) AS total_text_count
FROM wordspertag
GROUP BY page, tag
ORDER BY total_text_count DESC
LIMIT 10;