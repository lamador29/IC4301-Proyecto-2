USE proyecto1;

ALTER TABLE `wordstogetherpertag`
ADD INDEX `idx_word1` (`word1`) USING BTREE,
ADD INDEX `idx_word2` (`word2`) USING BTREE;