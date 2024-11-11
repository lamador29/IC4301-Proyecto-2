USE mysql;

CREATE USER 'proyecto1'@'localhost' IDENTIFIED BY '12345';

GRANT ALL PRIVILEGES ON *.* TO 'proyecto1'@'localhost';

FLUSH PRIVILEGES;