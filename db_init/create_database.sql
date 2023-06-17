-- Adminer 4.8.1 MySQL 8.0.33 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

USE `toolcrib`;

SET NAMES utf8mb4;

CREATE TABLE `loghistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teamNumber` int NOT NULL,
  `tableNumber` int NOT NULL,
  `teamMember` text NOT NULL,
  `date` text NOT NULL,
  `toolLimit` int NOT NULL,
  `toolName` text NOT NULL,
  `notes` text,
  `status` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `managelogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teamNumber` int NOT NULL,
  `tableNumber` int NOT NULL,
  `teamMember` text NOT NULL,
  `dueDate` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `toolLimit` int NOT NULL,
  `toolName` text NOT NULL,
  `notes` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `manageteams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teamNumber` int NOT NULL,
  `tableNumber` int NOT NULL,
  `teamMembers` text NOT NULL,
  `tokens` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `managetools` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tool` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 2023-05-20 20:12:26
