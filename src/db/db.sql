CREATE DATABASE IF NOT EXISTS `publicdata` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS `publicdata`@`localhost` IDENTIFIED WITH mysql_native_password BY '1234';
GRANT ALL PRIVILEGES ON `publicdata`.* TO `publicdata`@`localhost`;

USE `publicdata`;

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(20),
    `nickname` VARCHAR(20),
    `phone` VARCHAR(20),
    `address` VARCHAR(100),
    `username` VARCHAR(20),
    `password` VARCHAR(100),
    UNIQUE KEY(`username`)
);

DROP TABLE IF EXISTS `goodshop`;

CREATE TABLE `goodshop` (
    `id` INT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `industry_code` INT NOT NULL,
    `address` VARCHAR(300) NOT NULL,
    `phone` VARCHAR(20),
    `info` VARCHAR(1000) NULL,
    `hash` VARCHAR(70) NOT NULL,
    `lat` DECIMAL(15, 10),
    `lng` DECIMAL(15, 10)
);

DROP TABLE IF EXISTS `board`;

CREATE TABLE `board` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `userid` INT,
    `title` VARCHAR(100),
    `content` VARCHAR(1000),
    `cnt_like` INT,
    `created_time` DATETIME DEFAULT now()
);

DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `userid` INT,
    `boardid` INT,
    `content` VARCHAR(1000),
    `created_time` DATETIME DEFAULT now()
);

DROP TABLE IF EXISTS `review`;

CREATE TABLE `review` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `userid` INT,
    `placeid` INT,
    `score` FLOAT,
    `content` VARCHAR(1000),
    `created_time` DATETIME DEFAULT now()
);