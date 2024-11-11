USE mysql;

CREATE TABLE `pages` (
	`url` VARCHAR(200) NOT NULL,
	`title` VARCHAR(100) NOT NULL,
	`wordTotal` INT NOT NULL DEFAULT 0,
	PRIMARY KEY (`url`)
)
COLLATE='latin1_swedish_ci'
;
