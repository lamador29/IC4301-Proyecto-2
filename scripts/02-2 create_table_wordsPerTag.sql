USE proyecto1;

CREATE TABLE `wordspertag` (
	`id` INT(11) NOT NULL,
	`page` VARCHAR(200) NOT NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`word` VARCHAR(200) NOT NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`tag` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`amount` INT(11) NOT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_wordspertag_pages` (`page`) USING BTREE,
	CONSTRAINT `FK_wordspertag_pages` FOREIGN KEY (`page`) REFERENCES `pages` (`title`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;