CREATE TABLE `wordstogetherpertag` (
	`id` INT(11) NOT NULL,
	`page` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`word1` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`word2` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`tag` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`amount` INT(11) NOT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_wtpt_pages` (`page`) USING BTREE,
	INDEX `FK_wtpt_words` (`word1`) USING BTREE,
	INDEX `FK_wtpt_words_2` (`word2`) USING BTREE,
	INDEX `FK_wtpt_tags` (`tag`) USING BTREE,
	CONSTRAINT `FK_wtpt_pages` FOREIGN KEY (`page`) REFERENCES `pages` (`url`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `FK_wtpt_tags` FOREIGN KEY (`tag`) REFERENCES `tags` (`tag`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `FK_wtpt_words` FOREIGN KEY (`word1`) REFERENCES `words` (`word`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `FK_wtpt_words_2` FOREIGN KEY (`word2`) REFERENCES `words` (`word`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
