USE proyecto1;

INSERT INTO wikipedia (id, amountWords, amountPages)
VALUES (1, 
    (SELECT SUM(amount) FROM wordspertag), 
    (SELECT COUNT(*) FROM pages)
);