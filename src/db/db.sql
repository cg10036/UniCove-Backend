CREATE DATABASE IF NOT EXISTS `publicdata` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS `publicdata`@`localhost` IDENTIFIED WITH mysql_native_password BY '1234';
GRANT ALL PRIVILEGES ON `publicdata`.* TO `publicdata`@`localhost`;

USE `publicdata`;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(20),
    `password` VARCHAR(100),
    UNIQUE KEY(`username`)
);