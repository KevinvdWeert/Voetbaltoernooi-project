-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 26, 2025 at 12:42 PM
-- Server version: 9.4.0
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `voetbaltoernooi`
--

-- --------------------------------------------------------

--
-- Table structure for table `matches`
--

CREATE TABLE `matches` (
  `id` int NOT NULL,
  `match_date` datetime NOT NULL,
  `field` varchar(45) DEFAULT NULL,
  `team_a_id` int NOT NULL,
  `team_b_id` int NOT NULL,
  `status` enum('scheduled','finished','cancelled') DEFAULT 'scheduled',
  `team_a_score` int DEFAULT NULL,
  `team_b_score` int DEFAULT NULL,
  `reported_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `matches`
--

INSERT INTO `matches` (`id`, `match_date`, `field`, `team_a_id`, `team_b_id`, `status`, `team_a_score`, `team_b_score`, `reported_at`) VALUES
(8, '2025-12-01 14:00:00', 'Field 1', 1, 2, 'finished', 3, 1, NULL),
(9, '2025-12-01 16:00:00', 'Field 2', 3, 4, 'finished', 2, 2, NULL),
(10, '2025-12-02 14:00:00', 'Field 1', 1, 3, 'scheduled', NULL, NULL, NULL),
(11, '2025-12-02 16:00:00', 'Field 2', 2, 5, 'scheduled', NULL, NULL, NULL),
(12, '2025-12-03 14:00:00', 'Field 1', 4, 5, 'scheduled', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'player');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `captain_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `captain_id`, `created_at`) VALUES
(1, 'FC Lightning', 2, '2025-11-26 12:31:59'),
(2, 'Red Dragons', 3, '2025-11-26 12:31:59'),
(3, 'Blue Wolves', 4, '2025-11-26 12:31:59'),
(4, 'Golden Eagles', 5, '2025-11-26 12:31:59'),
(5, 'Thunder Hawks', 6, '2025-11-26 12:31:59');

-- --------------------------------------------------------

--
-- Table structure for table `team_players`
--

CREATE TABLE `team_players` (
  `id` int NOT NULL,
  `team_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `jersey_number` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `team_players`
--

INSERT INTO `team_players` (`id`, `team_id`, `user_id`, `name`, `jersey_number`) VALUES
(118, 1, 2, 'Bob Janssen', '1'),
(119, 1, NULL, 'Player 2', '2'),
(120, 1, NULL, 'Player 3', '3'),
(121, 1, NULL, 'Player 4', '4'),
(122, 1, NULL, 'Player 5', '5'),
(123, 1, NULL, 'Player 6', '6'),
(124, 1, NULL, 'Player 7', '7'),
(125, 1, NULL, 'Player 8', '8'),
(126, 1, NULL, 'Player 9', '9'),
(127, 1, NULL, 'Player 10', '10'),
(128, 1, NULL, 'Player 11', '11'),
(129, 2, 3, 'Charlie de Boer', '1'),
(130, 2, NULL, 'Player 2', '2'),
(131, 2, NULL, 'Player 3', '3'),
(132, 2, NULL, 'Player 4', '4'),
(133, 2, NULL, 'Player 5', '5'),
(134, 2, NULL, 'Player 6', '6'),
(135, 2, NULL, 'Player 7', '7'),
(136, 2, NULL, 'Player 8', '8'),
(137, 2, NULL, 'Player 9', '9'),
(138, 2, NULL, 'Player 10', '10'),
(139, 2, NULL, 'Player 11', '11'),
(140, 3, 4, 'Daan Willems', '1'),
(141, 3, NULL, 'Player 2', '2'),
(142, 3, NULL, 'Player 3', '3'),
(143, 3, NULL, 'Player 4', '4'),
(144, 3, NULL, 'Player 5', '5'),
(145, 3, NULL, 'Player 6', '6'),
(146, 3, NULL, 'Player 7', '7'),
(147, 3, NULL, 'Player 8', '8'),
(148, 3, NULL, 'Player 9', '9'),
(149, 3, NULL, 'Player 10', '10'),
(150, 3, NULL, 'Player 11', '11'),
(151, 4, 5, 'Eva de Vries', '1'),
(152, 4, NULL, 'Player 2', '2'),
(153, 4, NULL, 'Player 3', '3'),
(154, 4, NULL, 'Player 4', '4'),
(155, 4, NULL, 'Player 5', '5'),
(156, 4, NULL, 'Player 6', '6'),
(157, 4, NULL, 'Player 7', '7'),
(158, 4, NULL, 'Player 8', '8'),
(159, 4, NULL, 'Player 9', '9'),
(160, 4, NULL, 'Player 10', '10'),
(161, 4, NULL, 'Player 11', '11'),
(162, 5, 6, 'Fleur Hendriks', '1'),
(163, 5, NULL, 'Player 2', '2'),
(164, 5, NULL, 'Player 3', '3'),
(165, 5, NULL, 'Player 4', '4'),
(166, 5, NULL, 'Player 5', '5'),
(167, 5, NULL, 'Player 6', '6'),
(168, 5, NULL, 'Player 7', '7'),
(169, 5, NULL, 'Player 8', '8'),
(170, 5, NULL, 'Player 9', '9'),
(171, 5, NULL, 'Player 10', '10'),
(172, 5, NULL, 'Player 11', '11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role_id`, `created_at`) VALUES
(1, 'Alice Vermeer', 'alice@example.com', 'hash', 1, '2025-11-26 12:31:59'),
(2, 'Bob Janssen', 'bob@example.com', 'hash', 2, '2025-11-26 12:31:59'),
(3, 'Charlie de Boer', 'charlie@example.com', 'hash', 2, '2025-11-26 12:31:59'),
(4, 'Daan Willems', 'daan@example.com', 'hash', 2, '2025-11-26 12:31:59'),
(5, 'Eva de Vries', 'eva@example.com', 'hash', 2, '2025-11-26 12:31:59'),
(6, 'Fleur Hendriks', 'fleur@example.com', 'hash', 2, '2025-11-26 12:31:59'),
(7, 'Gert-Jan Koster', 'gertjan@example.com', 'hash', 2, '2025-11-26 12:31:59'),
(8, 'Hugo Bakker', 'hugo@example.com', 'hash', 2, '2025-11-26 12:31:59'),
(9, 'Iris Peters', 'iris@example.com', 'hash', 2, '2025-11-26 12:31:59'),
(10, 'Jeroen van Dam', 'jeroen@example.com', 'hash', 2, '2025-11-26 12:31:59'),
(11, 'Kim Zwart', 'kim@example.com', 'hash', 2, '2025-11-26 12:31:59'),
(12, 'Lars Meijer', 'lars@example.com', 'hash', 2, '2025-11-26 12:31:59'),
(13, 'Milan Vos', 'milan@example.com', 'hash', 2, '2025-11-26 12:31:59'),
(14, 'Nina Scholten', 'nina@example.com', 'hash', 2, '2025-11-26 12:31:59'),
(15, 'Olivier Kok', 'olivier@example.com', 'hash', 2, '2025-11-26 12:31:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `matches`
--
ALTER TABLE `matches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `team_a_id` (`team_a_id`),
  ADD KEY `team_b_id` (`team_b_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `captain_id` (`captain_id`);

--
-- Indexes for table `team_players`
--
ALTER TABLE `team_players`
  ADD PRIMARY KEY (`id`),
  ADD KEY `team_id` (`team_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `matches`
--
ALTER TABLE `matches`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `team_players`
--
ALTER TABLE `team_players`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `matches`
--
ALTER TABLE `matches`
  ADD CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`team_a_id`) REFERENCES `teams` (`id`),
  ADD CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`team_b_id`) REFERENCES `teams` (`id`);

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`captain_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `team_players`
--
ALTER TABLE `team_players`
  ADD CONSTRAINT `team_players_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`),
  ADD CONSTRAINT `team_players_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
