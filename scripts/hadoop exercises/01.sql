USE proyecto1;
/* Filas afectadas: 0  Filas encontradas: 100 000  Advertencias: 0  Duración para 2 consultas: 1,469 seg. (+ 0,031 seg. red) */

SELECT DISTINCT word, page 
FROM wordspertag
LIMIT 100000;