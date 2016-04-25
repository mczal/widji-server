-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2016 at 07:06 PM
-- Server version: 5.6.24
-- PHP Version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `widjimeke`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `associate_orderItem_stock`(IN `idProduct` INT, IN `quantityz` INT, IN `idOrderItem` INT)
    NO SQL
BEGIN

	DECLARE finished INTEGER DEFAULT 0;
	
	DECLARE idMaterial INT DEFAULT 0 ;
	DECLARE materialQuantityUsed INT DEFAULT 0;
	
	DECLARE tempQuantity INT DEFAULT 0;
	DECLARE tempMaterialName VARCHAR(30);

	DEClARE myCursor CURSOR FOR 
 	SELECT DISTINCT material_id,material_quantity_used from `product_material` where product_id = idProduct;

	DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished = 1;

OPEN myCursor;

label1: LOOP

	FETCH myCursor INTO idMaterial,materialQuantityUsed;
	IF finished = 1 THEN 
		LEAVE label1;
	END IF;

	
	SELECT quantity INTO tempQuantity from `material` where id_material = idMaterial;
	SELECT material_name INTO tempMaterialName from `material` where id_material = idMaterial;

	

	IF tempQuantity < (materialQuantityUsed*quantityz) THEN
			INSERT INTO `stock_monitoring` (order_item_id,id_material,material_name,status)
			VALUES (idOrderItem,idMaterial,tempMaterialName,-1);
		ELSE
			UPDATE `material` SET quantity = tempQuantity-materialQuantityUsed where id_material = idMaterial;
				
			INSERT INTO `stock_monitoring` (order_item_id,id_material,material_name,status)
			VALUES (idOrderItem,idMaterial,tempMaterialName,1);
		END IF;


 END LOOP label1;


CLOSE myCursor;


END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `test_proc`(IN `idProduct` INT, IN `quantityz` INT, OUT `statusz` INT, IN `idOrderItem` INT)
BEGIN

	DECLARE finished INTEGER DEFAULT 0;
	
	DECLARE idMaterial INT DEFAULT 0 ;
	DECLARE materialQuantityUsed INT DEFAULT 0;
	
	DECLARE tempQuantity INT DEFAULT 0;
	DECLARE tempMaterialName VARCHAR(30);

	DEClARE myCursor CURSOR FOR 
 	SELECT DISTINCT material_id,material_quantity_used from `product_material` where product_id = idProduct;

	DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET finished = 1;

OPEN myCursor;

label1: LOOP

	FETCH myCursor INTO idMaterial,materialQuantityUsed;
	IF finished = 1 THEN 
		LEAVE label1;
	END IF;

	
	SELECT quantity INTO tempQuantity from `material` where id_material = idMaterial;
	SELECT material_name INTO tempMaterialName from `material` where id_material = idMaterial;

	

	IF tempQuantity < (materialQuantityUsed*quantityz) THEN
			INSERT INTO `stock_monitoring` (order_item_id,id_material,material_name,status)
			VALUES (idOrderItem,idMaterial,tempMaterialName,-1);
		ELSE
			UPDATE `material` SET quantity = tempQuantity-materialQuantityUsed where id_material = idMaterial;
				
			INSERT INTO `stock_monitoring` (order_item_id,id_material,material_name,status)
			VALUES (idOrderItem,idMaterial,tempMaterialName,1);
		END IF;


 END LOOP label1;


CLOSE myCursor;


END$$

DELIMITER ;

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
(2, 'konter', '2', 1, 2, NULL),
(3, NULL, '3', 0, NULL, NULL),
(4, NULL, '4', 0, NULL, NULL),
(5, '10', '5', 0, NULL, 4),
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
-- Table structure for table `customer`
--

CREATE TABLE IF NOT EXISTS `customer` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `membership_id` int(11) DEFAULT NULL,
  `birthdate` date DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `name`, `phone`, `email`, `membership_id`, `birthdate`) VALUES
(1, 'jojon', '0856', NULL, NULL, NULL),
(2, 'Fahrizal', '089-625-252-789', 'adfasdf', 1, '0000-00-00'),
(3, 'jonjon', '123-456-789', NULL, NULL, NULL),
(4, 'Meke', '910-283-719-23', 'meke@meke.com', 1, '0000-00-00'),
(5, 'brader', '890-212-312-312', 'jkalsd@mgialsdf.com', 1, '0000-00-00'),
(6, 'Meke', '213-123-123-123', 'mekemeke', 1, '1994-12-30'),
(8, 'maman', '123-794-801-234', 'asdf', 1, '0000-00-00'),
(9, 'distra', '378-091-231-231', 'asdfjkl', 1, '0000-00-00');

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
(1, 'abc12test', 'testing katun', 'meter', 200, 'roll', 4);

-- --------------------------------------------------------

--
-- Table structure for table `membership`
--

CREATE TABLE IF NOT EXISTS `membership` (
  `id` int(11) NOT NULL,
  `membership_code` varchar(5) NOT NULL,
  `name` varchar(30) NOT NULL,
  `discount` double NOT NULL,
  `desc` varchar(200) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `membership`
--

INSERT INTO `membership` (`id`, `membership_code`, `name`, `discount`, `desc`) VALUES
(1, '12345', 'gold', 15, '');

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
  `name` varchar(50) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `tanggal_pengambilan` date DEFAULT NULL,
  `jam_pengambilan` time DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `jumlah_bayar` double NOT NULL,
  `discount` double DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `no_bon`, `created_at`, `updated_at`, `status`, `name`, `customer_id`, `tanggal_pengambilan`, `jam_pengambilan`, `keterangan`, `jumlah_bayar`, `discount`) VALUES
(2, '1639234124133', '2016-04-09 16:41:24', '2016-04-09 16:41:24', 1, 'Fahrizal', 2, '2016-04-10', '13:20:00', 'Cek cek information is here', 0, 15),
(3, '163103944149', '2016-04-09 20:09:44', '2016-04-09 20:09:44', 1, 'Fahrizal', 2, '2016-04-12', '13:32:00', 'asdfasdfasdf', 0, 15),
(5, '163107577445', '2016-04-10 00:57:07', '2016-04-10 00:57:07', 1, 'jonjon', 3, NULL, NULL, NULL, 0, 15),
(6, '163108418403', '2016-04-10 01:04:18', '2016-04-10 01:04:18', 1, 'jonjon', 3, NULL, NULL, NULL, 0, 15),
(7, '163108935242', '2016-04-10 01:09:35', '2016-04-10 01:09:35', 1, 'jonjon', 3, NULL, NULL, NULL, 0, 15),
(8, '1631081735267', '2016-04-10 01:17:35', '2016-04-10 01:17:35', 1, 'jonjon', 3, NULL, NULL, NULL, 0, 15),
(9, '1631084439704', '2016-04-10 01:44:39', '2016-04-10 01:44:39', 1, 'jonjon', 3, NULL, NULL, NULL, 0, 15),
(10, '1631084615482', '2016-04-10 01:46:15', '2016-04-10 01:46:15', 1, 'jonjon', 3, NULL, NULL, NULL, 0, 15),
(11, '16310193712669', '2016-04-10 12:37:12', '2016-04-10 12:37:12', 1, 'Fahrizal', 2, '2016-04-13', '09:00:00', 'blahblahblahblah', 0, 15),
(12, '1631019394533', '2016-04-10 12:39:04', '2016-04-10 12:39:04', 1, 'jonjon', 3, '2016-04-16', '13:30:00', 'jkl;admfiladca', 0, 15),
(13, '1631114220784', '2016-04-11 07:02:20', '2016-04-11 07:02:20', 1, 'Fahrizal', 2, '2016-04-23', '13:00:00', 'blah blah blah blah', 0, 15),
(14, '16311151411901', '2016-04-11 08:14:11', '2016-04-11 08:14:11', 1, 'jonjon', 3, NULL, NULL, NULL, 0, 15),
(15, '1631115144650', '2016-04-11 08:14:46', '2016-04-11 08:14:46', 0, 'Fahrizal', 2, NULL, NULL, NULL, 3150, NULL),
(17, '16311151616924', '2016-04-11 08:16:16', '2016-04-11 08:16:16', 0, 'Fahrizal', 2, '2016-04-23', '21:00:00', 'asd asdfasdfa', 22950, NULL),
(18, '16311151938395', '2016-04-11 08:19:38', '2016-04-11 08:19:38', 0, 'jonjon', 3, '2016-04-23', '13:23:00', 's asdf asdf asdf', 2400, NULL),
(19, '16311152139221', '2016-04-11 08:21:39', '2016-04-11 08:21:39', 1, 'Fahrizal', 2, NULL, NULL, NULL, 0, 15),
(20, '16311152320777', '2016-04-11 08:23:20', '2016-04-11 08:23:20', 1, 'Fahrizal', 2, '2016-04-16', '11:15:00', 'a sdfj kalsd fad', 0, 15);

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE IF NOT EXISTS `order_item` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`id`, `product_id`, `order_id`, `quantity`, `price`) VALUES
(1, 13, 1, 1, 5000),
(3, 3, 2, 11, 23100),
(4, 2, 2, 3, 7500),
(5, 3, 3, 1, 2100),
(6, 4, 3, 3, 6000),
(7, 8, 3, 1, 500),
(8, 3, 5, 2, 4200),
(9, 4, 5, 4, 8000),
(10, 7, 5, 1, 5000),
(11, 8, 5, 2, 1000),
(12, 3, 6, 3, 6300),
(13, 4, 6, 14, 28000),
(15, 4, 7, 3, 6000),
(16, 8, 7, 12, 6000),
(17, 7, 7, 20, 100000),
(18, 3, 8, 23, 48300),
(19, 2, 8, 13, 32500),
(20, 3, 9, 123, 258300),
(21, 3, 10, 21, 44100),
(22, 3, 11, 12, 25200),
(23, 4, 11, 2, 4000),
(24, 3, 12, 21, 44100),
(25, 13, 13, 12, 1800),
(26, 13, 14, 21, 3150),
(27, 13, 15, 21, 3150),
(28, 13, 17, 3, 450),
(29, 16, 18, 12, 2400),
(30, 13, 19, 2, 300),
(31, 13, 20, 3, 450),
(32, 15, 20, 12, 90000),
(33, 17, 20, 1, 400),
(34, 18, 20, 1, 900),
(35, 15, 17, 3, 22500);

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
  `imgbase64` varchar(255) NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `category_id`, `media`, `size`, `status`, `weight`, `imgbase64`, `price`) VALUES
(12, 7, 'plain paper', 'a2', 1, 0.8, 'http://localhost/widji-server/assets/img/products/product_7_plain paper_a2_0.8_2000.jpeg', 2000),
(13, 1, 'plain paper', 'HVS', 1, 1.02, 'http://localhost/widji-server/assets/img/products/product_1_plain paper_HVS_1.02_150.jpeg', 150),
(14, 2, 'photo paper', 'A0', 0, 1.32, 'http://localhost/widji-server/assets/img/products/product_2_photo paper_A0_1.32_500.jpeg', 500),
(15, 3, 'Banner', 'A0', 1, 1.02, 'http://localhost/widji-server/assets/img/products/product_3_Banner_A0_1.02_7500.jpeg', 7500),
(16, 4, 'plain paper', 'Folio', 1, 0.83, 'http://localhost/widji-server/assets/img/products/product_4_plain paper_Folio_0.83_200.jpeg', 200),
(17, 5, 'blah blah media', 'blah size', 1, 1.23, 'http://localhost/widji-server/assets/img/products/product_5_blah blah media_blah size_1.23_400.jpeg', 400),
(18, 6, 'plain paper', 'A3', 1, 0.9, 'http://localhost/widji-server/assets/img/products/product_6_plain paper_A3_0.9_900.jpeg', 900),
(19, 7, 'photo paper', 'A0', 1, 2.3, 'http://localhost/widji-server/assets/img/products/product_7_photo paper_A0_2.3_3000.jpeg', 3000);

-- --------------------------------------------------------

--
-- Table structure for table `product_category`
--

CREATE TABLE IF NOT EXISTS `product_category` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(200) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_category`
--

INSERT INTO `product_category` (`id`, `name`, `description`) VALUES
(1, 'Black & White', NULL),
(2, 'Full Color', NULL),
(3, 'Outdoor', NULL),
(4, 'Jilid Binding', NULL),
(5, 'Fotocopy', NULL),
(6, 'Lainnya', NULL),
(7, 'Item Tambahan', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_material`
--

CREATE TABLE IF NOT EXISTS `product_material` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `material_quantity_used` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_material`
--

INSERT INTO `product_material` (`id`, `product_id`, `material_id`, `material_quantity_used`) VALUES
(1, 13, 1, 3),
(2, 14, 1, 1),
(3, 15, 1, 2),
(4, 16, 1, 5),
(5, 18, 1, 2),
(6, 19, 1, 2);

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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id_session`, `session_code`, `id_user`) VALUES
(20, '}:PbC{)]}}', 2);

-- --------------------------------------------------------

--
-- Table structure for table `stock_monitoring`
--

CREATE TABLE IF NOT EXISTS `stock_monitoring` (
  `id` int(11) NOT NULL,
  `order_item_id` int(11) NOT NULL,
  `id_material` int(11) NOT NULL,
  `material_name` varchar(30) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stock_monitoring`
--

INSERT INTO `stock_monitoring` (`id`, `order_item_id`, `id_material`, `material_name`, `status`) VALUES
(1, 2, 1, 'testing katun', 1),
(2, 1, 1, 'testing katun', 1),
(3, 1, 1, 'testing katun', 1);

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
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `phone` (`phone`), ADD UNIQUE KEY `email` (`email`), ADD KEY `membership` (`membership_id`), ADD KEY `membership_id` (`membership_id`);

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
-- Indexes for table `membership`
--
ALTER TABLE `membership`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `barcode_code` (`membership_code`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `no_bon` (`no_bon`), ADD KEY `customer_id` (`customer_id`);

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
-- Indexes for table `product_material`
--
ALTER TABLE `product_material`
  ADD PRIMARY KEY (`id`), ADD KEY `product_id` (`product_id`), ADD KEY `material_id` (`material_id`);

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
-- Indexes for table `stock_monitoring`
--
ALTER TABLE `stock_monitoring`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
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
-- AUTO_INCREMENT for table `membership`
--
ALTER TABLE `membership`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=36;
--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=20;
--
-- AUTO_INCREMENT for table `product_category`
--
ALTER TABLE `product_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `product_material`
--
ALTER TABLE `product_material`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
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
  MODIFY `id_session` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `stock_monitoring`
--
ALTER TABLE `stock_monitoring`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
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
-- Constraints for table `customer`
--
ALTER TABLE `customer`
ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`membership_id`) REFERENCES `membership` (`id`);

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
-- Constraints for table `order`
--
ALTER TABLE `order`
ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_category` (`id`);

--
-- Constraints for table `product_material`
--
ALTER TABLE `product_material`
ADD CONSTRAINT `product_material_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
ADD CONSTRAINT `product_material_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `material` (`id_material`);

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
