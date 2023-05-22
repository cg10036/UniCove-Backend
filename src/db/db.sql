CREATE DATABASE IF NOT EXISTS `publicdata` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS `publicdata`@`localhost` IDENTIFIED WITH mysql_native_password BY '1234';
GRANT ALL PRIVILEGES ON `publicdata`.* TO `publicdata`@`localhost`;

USE `publicdata`;

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(20),
    `phone` VARCHAR(20),
    `address` VARCHAR(100),
    `username` VARCHAR(20),
    `password` VARCHAR(100),
    `profile` LONGTEXT,
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

DROP TABLE IF EXISTS `like`;

CREATE TABLE `like` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `boardid` INT NOT NULL,
    `userid` INT NOT NULL,
    UNIQUE (`boardid`, `userid`)
);

DROP TABLE IF EXISTS `nightstudy`;

CREATE TABLE `nightstudy` (
    `id` BIGINT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `address` VARCHAR(300) NOT NULL,
    `phone` VARCHAR(20),
    `lat` DECIMAL(15, 10),
    `lng` DECIMAL(15, 10),
    `is24` TINYINT NOT NULL,
    `info` VARCHAR(1000)
);

DROP TABLE IF EXISTS `goodshop_review`;

CREATE TABLE `goodshop_review` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `goodshop_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `score` INT NOT NULL,
    `created_time` DATETIME NOT NULL DEFAULT NOW(),
    `content` TEXT NOT NULL,
    UNIQUE (`goodshop_id`, `user_id`)
);

DROP TABLE IF EXISTS `nightstudy_review`;

CREATE TABLE `nightstudy_review` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `nightstudy_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `score` INT NOT NULL,
    `created_time` DATETIME NOT NULL DEFAULT NOW(),
    `content` TEXT NOT NULL,
    UNIQUE (`nightstudy_id`, `user_id`)
);

DROP TABLE IF EXISTS `goodshop_like`;

CREATE TABLE `goodshop_like` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `goodshop_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    UNIQUE (`goodshop_id`, `user_id`)
);

DROP TABLE IF EXISTS `nightstudy_like`;

CREATE TABLE `nightstudy_like` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `nightstudy_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    UNIQUE (`nightstudy_id`, `user_id`)
);