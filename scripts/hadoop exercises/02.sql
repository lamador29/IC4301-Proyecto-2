USE proyecto1;
/* Filas afectadas: 0  Filas encontradas: 100 000  Advertencias: 0  Duración para 2 consultas: 1,844 seg. (+ 0,047 seg. red) */

SELECT DISTINCT word1, word2, page 
FROM wordstogetherpertag
LIMIT 100000;