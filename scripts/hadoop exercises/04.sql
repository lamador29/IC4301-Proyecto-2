USE proyecto1;
/* Filas afectadas: 0  Filas encontradas: 100 000  Advertencias: 0  Duración para 2 consultas: 00:08:13.9 (+ 0,078 seg. red) */

SELECT word, SUM(amount) AS total_count
FROM wordspertag
GROUP BY word
LIMIT 100000;