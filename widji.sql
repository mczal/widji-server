-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 01, 2016 at 01:14 AM
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
  `id_user` int(11) DEFAULT NULL,
  `id_queue` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `counter`
--

INSERT INTO `counter` (`id_counter`, `ip_addrs`, `counter_name`, `statusz`, `id_user`, `id_queue`) VALUES
(1, '1', '1', 0, NULL, NULL),
(2, NULL, '2', 0, NULL, NULL),
(3, NULL, '3', 0, NULL, NULL),
(4, NULL, '4', 0, NULL, NULL),
(5, '10', '5', 1, 2, 4),
(6, NULL, '6', 0, NULL, NULL),
(7, NULL, '7', 0, NULL, NULL);

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
(1, 5);

-- --------------------------------------------------------

--
-- Table structure for table `display`
--

CREATE TABLE IF NOT EXISTS `display` (
  `id_display` int(11) NOT NULL,
  `display_name` varchar(50) NOT NULL,
  `value` varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `display`
--

INSERT INTO `display` (`id_display`, `display_name`, `value`) VALUES
(1, 'running text', 'abcde');

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
-- Table structure for table `material`
--

CREATE TABLE IF NOT EXISTS `material` (
  `id_material` int(11) NOT NULL,
  `material_code` varchar(10) NOT NULL,
  `material_name` varchar(100) NOT NULL,
  `smallest_unit` varchar(30) NOT NULL,
  `stock_per_unit` int(11) NOT NULL,
  `unit_name` varchar(30) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `material`
--

INSERT INTO `material` (`id_material`, `material_code`, `material_name`, `smallest_unit`, `stock_per_unit`, `unit_name`, `quantity`) VALUES
(1, 'abc12test', 'testing katun', 'meter', 200, 'roll', 22);

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE IF NOT EXISTS `order` (
  `id` int(11) NOT NULL,
  `no_bon` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(4) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `no_bon`, `created_at`, `updated_at`, `status`, `name`) VALUES
(1, '1623023348541', '2016-03-30 16:34:08', '2016-03-30 16:34:08', 0, 'zahid'),
(2, '163161127909', '2016-03-31 23:11:27', '2016-03-31 23:11:27', 0, 'Mohamad Fahrizal');

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE IF NOT EXISTS `order_item` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`id`, `product_id`, `order_id`, `quantity`) VALUES
(1, 1, 1, 1),
(2, 2, 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE IF NOT EXISTS `product` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `media` varchar(20) NOT NULL,
  `size` varchar(20) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `weight` double NOT NULL,
  `imgbase64` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `category_id`, `media`, `size`, `status`, `weight`, `imgbase64`) VALUES
(1, 1, 'HVS', 'A3', 0, 1.5, 'loremipsumdolorsitamet'),
(2, 2, 'HVS', 'A5', 1, 1.231, 'ipsumdolorsitamet'),
(3, 1, 'Letter', 'A1', 1, 1.33, 'ampunkk');

-- --------------------------------------------------------

--
-- Table structure for table `product_category`
--

CREATE TABLE IF NOT EXISTS `product_category` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(200) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_category`
--

INSERT INTO `product_category` (`id`, `name`, `description`) VALUES
(1, 'Black and White', NULL),
(2, 'Full Color', NULL);

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

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `id_role` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id_role`, `role_name`) VALUES
(1, 'admin'),
(2, 'user');

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE IF NOT EXISTS `session` (
  `id_session` int(11) NOT NULL,
  `session_code` varchar(15) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id_session`, `session_code`, `id_user`) VALUES
(12, 'a', 1),
(13, 'hU(TU933I4', 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id_user` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `id_role` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `username`, `password`, `id_role`) VALUES
(1, 'admin', '24c9e15e52afc47c225b757e7bee1f9d', 1),
(2, 'user1', '24c9e15e52afc47c225b757e7bee1f9d', 2),
(4, 'admin2', 'c84258e9c39059a89ab77d846ddab909', 1),
(5, 'adminTest', '72adc15352810c6d960fea7edb398c77', 1),
(6, 'user2', '7e58d63b60197ceb55a1c487989a3720', 2);

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
  ADD PRIMARY KEY (`id_counter`), ADD UNIQUE KEY `ip_addrs` (`ip_addrs`), ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `count_display`
--
ALTER TABLE `count_display`
  ADD PRIMARY KEY (`id_count_display`);

--
-- Indexes for table `display`
--
ALTER TABLE `display`
  ADD PRIMARY KEY (`id_display`);

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
-- Indexes for table `material`
--
ALTER TABLE `material`
  ADD PRIMARY KEY (`id_material`), ADD UNIQUE KEY `kode_bahan` (`material_code`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `no_bon` (`no_bon`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`), ADD KEY `product_id` (`product_id`), ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`), ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_category`
--
ALTER TABLE `product_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `queue_rtn`
--
ALTER TABLE `queue_rtn`
  ADD PRIMARY KEY (`id_queue`), ADD KEY `id_counter` (`id_cat`), ADD KEY `id_counter_2` (`id_counter`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id_role`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id_session`), ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`), ADD UNIQUE KEY `username` (`username`), ADD KEY `id_role` (`id_role`);

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
-- AUTO_INCREMENT for table `display`
--
ALTER TABLE `display`
  MODIFY `id_display` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `last_display_queue`
--
ALTER TABLE `last_display_queue`
  MODIFY `id_display` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `material`
--
ALTER TABLE `material`
  MODIFY `id_material` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `product_category`
--
ALTER TABLE `product_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `queue_rtn`
--
ALTER TABLE `queue_rtn`
  MODIFY `id_queue` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id_role` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `id_session` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `counter`
--
ALTER TABLE `counter`
ADD CONSTRAINT `counter_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`);

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
-- Constraints for table `product`
--
ALTER TABLE `product`
ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_category` (`id`);

--
-- Constraints for table `queue_rtn`
--
ALTER TABLE `queue_rtn`
ADD CONSTRAINT `queue_rtn_ibfk_1` FOREIGN KEY (`id_cat`) REFERENCES `category` (`id_cat`),
ADD CONSTRAINT `queue_rtn_ibfk_2` FOREIGN KEY (`id_counter`) REFERENCES `counter` (`id_counter`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `role` (`id_role`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
