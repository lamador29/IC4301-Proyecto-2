USE proyecto1;

CREATE TABLE `lesswordstogetherpertag` (
	`id` INT(11) NOT NULL,
	`page` VARCHAR(200) NOT NULL COLLATE 'latin1_swedish_ci',
	`word1` VARCHAR(200) NOT NULL COLLATE 'latin1_swedish_ci',
	`word2` VARCHAR(200) NOT NULL COLLATE 'latin1_swedish_ci',
	`tag` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`amount` INT(11) NOT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_wtpt_pages` (`page`) USING BTREE,
	CONSTRAINT `FK_lesswordstogetherpertag_pages` FOREIGN KEY (`page`) REFERENCES `pages` (`title`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;