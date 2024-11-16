USE proyecto1;
/* Filas afectadas: 0  Filas encontradas: 100 000  Advertencias: 0  Duración para 2 consultas: 16,360 seg. (+ 0,312 seg. red) */

SELECT word1, word2, tag, page, SUM(amount) AS word_pair_count
FROM wordstogetherpertag
GROUP BY word1, word2, tag, page
LIMIT 100000;