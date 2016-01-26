-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 26, 2016 at 12:21 PM
-- Server version: 5.6.24
-- PHP Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `widji`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `id_cat` int(11) NOT NULL,
  `cat_name` varchar(2) NOT NULL,
  `cat_desc` varchar(300) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id_cat`, `cat_name`, `cat_desc`) VALUES
(1, 'a', ''),
(2, 'b', ''),
(3, 'c', '');

-- --------------------------------------------------------

--
-- Table structure for table `counter`
--

CREATE TABLE IF NOT EXISTS `counter` (
  `id_counter` int(11) NOT NULL,
  `ip_addrs` varchar(15) DEFAULT NULL,
  `counter_name` varchar(5) NOT NULL,
  `statusz` tinyint(4) NOT NULL,
  `id_queue` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `counter`
--

INSERT INTO `counter` (`id_counter`, `ip_addrs`, `counter_name`, `statusz`, `id_queue`) VALUES
(1, NULL, '1', 0, NULL),
(2, NULL, '2', 0, NULL),
(3, NULL, '3', 0, NULL),
(4, NULL, '4', 0, NULL),
(5, NULL, '5', 0, NULL),
(6, NULL, '6', 0, NULL),
(7, NULL, '7', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `count_display`
--

CREATE TABLE IF NOT EXISTS `count_display` (
  `id_count_display` int(11) NOT NULL,
  `value` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `count_display`
--

INSERT INTO `count_display` (`id_count_display`, `value`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `last_display_queue`
--

CREATE TABLE IF NOT EXISTS `last_display_queue` (
  `id_display` int(11) NOT NULL,
  `id_queue` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `last_entry_cat_queue`
--

CREATE TABLE IF NOT EXISTS `last_entry_cat_queue` (
  `id_cat` int(11) NOT NULL,
  `value` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `last_entry_cat_queue`
--

INSERT INTO `last_entry_cat_queue` (`id_cat`, `value`) VALUES
(1, 0),
(2, 0),
(3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `last_entry_counter_queue`
--

CREATE TABLE IF NOT EXISTS `last_entry_counter_queue` (
  `id_counter` int(11) NOT NULL,
  `value` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `last_entry_counter_queue`
--

INSERT INTO `last_entry_counter_queue` (`id_counter`, `value`) VALUES
(1, 0),
(2, 0),
(3, 0),
(4, 0),
(5, 0),
(6, 0),
(7, 0);

-- --------------------------------------------------------

--
-- Table structure for table `queue_rtn`
--

CREATE TABLE IF NOT EXISTS `queue_rtn` (
  `id_queue` int(11) NOT NULL,
  `queue_number` int(11) NOT NULL,
  `id_cat` int(11) NOT NULL,
  `id_counter` int(11) DEFAULT NULL,
  `statusz` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id_cat`);

--
-- Indexes for table `counter`
--
ALTER TABLE `counter`
  ADD PRIMARY KEY (`id_counter`), ADD UNIQUE KEY `ip_addrs` (`ip_addrs`);

--
-- Indexes for table `count_display`
--
ALTER TABLE `count_display`
  ADD PRIMARY KEY (`id_count_display`);

--
-- Indexes for table `last_display_queue`
--
ALTER TABLE `last_display_queue`
  ADD PRIMARY KEY (`id_display`), ADD KEY `id_queue` (`id_queue`);

--
-- Indexes for table `last_entry_cat_queue`
--
ALTER TABLE `last_entry_cat_queue`
  ADD PRIMARY KEY (`id_cat`), ADD KEY `id_cat` (`id_cat`);

--
-- Indexes for table `last_entry_counter_queue`
--
ALTER TABLE `last_entry_counter_queue`
  ADD PRIMARY KEY (`id_counter`);

--
-- Indexes for table `queue_rtn`
--
ALTER TABLE `queue_rtn`
  ADD PRIMARY KEY (`id_queue`), ADD KEY `id_counter` (`id_cat`), ADD KEY `id_counter_2` (`id_counter`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id_cat` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `counter`
--
ALTER TABLE `counter`
  MODIFY `id_counter` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `count_display`
--
ALTER TABLE `count_display`
  MODIFY `id_count_display` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `last_display_queue`
--
ALTER TABLE `last_display_queue`
  MODIFY `id_display` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `queue_rtn`
--
ALTER TABLE `queue_rtn`
  MODIFY `id_queue` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `last_entry_cat_queue`
--
ALTER TABLE `last_entry_cat_queue`
ADD CONSTRAINT `last_entry_cat_queue_ibfk_1` FOREIGN KEY (`id_cat`) REFERENCES `category` (`id_cat`);

--
-- Constraints for table `last_entry_counter_queue`
--
ALTER TABLE `last_entry_counter_queue`
ADD CONSTRAINT `last_entry_counter_queue_ibfk_1` FOREIGN KEY (`id_counter`) REFERENCES `counter` (`id_counter`);

--
-- Constraints for table `queue_rtn`
--
ALTER TABLE `queue_rtn`
ADD CONSTRAINT `queue_rtn_ibfk_1` FOREIGN KEY (`id_cat`) REFERENCES `category` (`id_cat`),
ADD CONSTRAINT `queue_rtn_ibfk_2` FOREIGN KEY (`id_counter`) REFERENCES `counter` (`id_counter`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
