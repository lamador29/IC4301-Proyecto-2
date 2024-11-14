USE mysql;

CREATE TABLE `pages` (
	`url` VARCHAR(200) NOT NULL COLLATE 'latin1_swedish_ci',
	`title` VARCHAR(200) NOT NULL COLLATE 'latin1_swedish_ci',
	`wordTotal` INT(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`title`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;