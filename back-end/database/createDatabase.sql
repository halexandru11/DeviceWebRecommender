--steps in order to create the database and the tables
--connect to mysql with user and password, by running the following command and replacing <username> and <password> with the actual values:
-- mysql -u <username> -p 
--enter the password when prompted
--run the following commands in the mysql console
--source <path to this file>
--it should create the database and the tables
--verify by running the following command:
--show tables;

CREATE DATABASE IF NOT EXISTS `gimme`;

USE `gimme`;

CREATE TABLE `gimme`.`users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NULL UNIQUE,
  `email` VARCHAR(128) NULL,
  `role` VARCHAR(64) NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `gimme`.`passwords` (
  `user_id` BIGINT NOT NULL,
  `password` VARCHAR(64) NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_passwords_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);

CREATE TABLE `gimme`.`products` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(512) NULL,
  `name` VARCHAR(256) NULL,
  `description` TEXT NULL,
  `vendor_name` VARCHAR(256) NULL,
  `price` FLOAT NULL,
  `rating` FLOAT NULL,
  `numReviews` FLOAT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `gimme`.`vendors` (
  `id` BIGINT AUTO_INCREMENT,
  `name` VARCHAR(64) NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `gimme`.`device_types` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `gimme`.`product_images` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT NULL,
  `image_url` VARCHAR(512) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_product_images_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
);

CREATE TABLE `preferences` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NULL,
  `vendor_name` VARCHAR(64) NULL,
  `device_type` VARCHAR(64) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_preferences_users` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE
);

CREATE TABLE `gimme`.`wishlist_products` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_url` VARCHAR(512) NULL,
  `name` VARCHAR(256) NULL,
  `description` TEXT NULL,
  `vendor_name` VARCHAR(256) NULL,
  `price` FLOAT NULL,
  `rating` FLOAT NULL,
  `numReviews` FLOAT NULL,
  `username` VARCHAR(512) NULL,
  `score` FLOAT DEFAULT 0,
  PRIMARY KEY (`id`)
);