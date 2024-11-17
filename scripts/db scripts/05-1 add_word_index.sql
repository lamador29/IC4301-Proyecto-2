USE proyecto1;

ALTER TABLE `wordspertag`
ADD INDEX `idx_word` (`word`) USING BTREE;