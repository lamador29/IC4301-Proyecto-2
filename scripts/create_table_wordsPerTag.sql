CREATE TABLE `wordspertag` (
	`id` INT(11) NOT NULL,
	`page` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`word` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`tag` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`amount` INT(11) NOT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_wpt_pages` (`page`) USING BTREE,
	INDEX `FK_wpt_tags` (`tag`) USING BTREE,
	INDEX `FK_wpt_words` (`word`) USING BTREE,
	CONSTRAINT `FK_wpt_pages` FOREIGN KEY (`page`) REFERENCES `pages` (`url`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `FK_wpt_tags` FOREIGN KEY (`tag`) REFERENCES `tags` (`tag`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `FK_wpt_words` FOREIGN KEY (`word`) REFERENCES `words` (`word`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
