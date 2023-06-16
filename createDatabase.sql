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
  `id` BIGINT NOT NULL,
  `username` VARCHAR(64) NULL,
  `email` VARCHAR(128) NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE `gimme`.`passwords` (
  `user_id` BIGINT NOT NULL,
  `password` VARCHAR(64) NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_passwords_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);


CREATE TABLE `gimme`.`wishlist_products` (
  `user_id` BIGINT NOT NULL,
  `product_id` BIGINT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_wishlist_products_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);


CREATE TABLE `gimme`.`products` (
  `id` BIGINT NOT NULL,
  `url` VARCHAR(512) NULL,
  `name` VARCHAR(256) NULL,
  `description` TEXT NULL,
  `vendor_id` BIGINT NULL,
  `price` FLOAT NULL,
  `rating` FLOAT NULL,
  `color` VARCHAR(32) NULL,
  `device_type_id` BIGINT NULL,
  `general_characteristics` TEXT NULL,
  `technical_characteristics` TEXT NULL,
  `processor` VARCHAR(320) NULL,
  `mother_board` TEXT NULL,
  `hard_disk` VARCHAR(512) NULL,
  `graphics_card` VARCHAR(1024) NULL,
  `memory` VARCHAR(320) NULL,
  `storage` VARCHAR(512) NULL,
  `display` VARCHAR(256) NULL,
  `connectivity` VARCHAR(256) NULL,
  `autonomy` SMALLINT NULL,
  `charging` VARCHAR(128) NULL,
  `efficiency` VARCHAR(512) NULL,
  `multimedia` VARCHAR(512) NULL,
  `photo_video` VARCHAR(512) NULL,
  `audio` VARCHAR(256) NULL,
  `software` VARCHAR(256) NULL,
  `functions` VARCHAR(1024) NULL,
  `smart_tv` VARCHAR(256) NULL,
  `dimentions` VARCHAR(256) NULL,
  `casing` VARCHAR(512) NULL,
  `accessories` VARCHAR(256) NULL,
  `energy_consumption` VARCHAR(256) NULL,
  `brand` VARCHAR(64) NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE `gimme`.`vendors` (
  `id` BIGINT NOT NULL,
  `name` VARCHAR(64) NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE `gimme`.`device_types` (
  `id` BIGINT NOT NULL,
  `name` VARCHAR(64) NULL,
  PRIMARY KEY (`id`)
);


CREATE TABLE `gimme`.`product_images` (
  `id` BIGINT NOT NULL,
  `product_id` BIGINT NULL,
  `image_url` VARCHAR(512) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_product_images_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
);