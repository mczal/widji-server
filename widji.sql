-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2016 at 06:50 AM
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

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `associate_orderItem_stock`(IN `idProduct` INT, IN `quantityz` INT, IN `idOrderItem` INT, IN `noBon` VARCHAR(30))
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
			INSERT INTO `stock_monitoring` (no_bon,order_item_id,id_material,material_name,status)
			VALUES (noBon,idOrderItem,idMaterial,tempMaterialName,-1);

			UPDATE `material` SET quantity = tempQuantity-(materialQuantityUsed*quantityz) where id_material = idMaterial;
		ELSE
			UPDATE `material` SET quantity = tempQuantity-(materialQuantityUsed*quantityz) where id_material = idMaterial;
				
			INSERT INTO `stock_monitoring` (no_bon,order_item_id,id_material,material_name,status)
			VALUES (noBon,idOrderItem,idMaterial,tempMaterialName,1);
		END IF;


 END LOOP label1;


CLOSE myCursor;


END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `inner_loop_stocks_report`(IN `productId` INT, IN `orderItemQuantity` INT, IN `noBon` VARCHAR(50), IN `luasOuter` VARCHAR(50))
    NO SQL
BEGIN

DECLARE materialCode VARCHAR (30);
DECLARE materialName VARCHAR (30);

DECLARE idMaterial INT DEFAULT 0;
DECLARE usedIdExist INT DEFAULT -1;
DECLARE materialQuantityUsed INT DEFAULT 0;
DECLARE luasWidth INT DEFAULT 0;
DECLARE luasHeight INT DEFAULT 0;
DECLARE luasInt INT DEFAULT 0;	
DECLARE finished INTEGER DEFAULT 0;
DECLARE myCursor CURSOR FOR SELECT DISTINCT material_id,material_quantity_used,material_code,material_name from `product_material` join `material` on product_material.material_id=material.id_material where product_material.product_id = productId;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;			
OPEN myCursor;
			
get_material: LOOP
	set usedIdExist = -1;
	FETCH myCursor INTO idMaterial,materialQuantityUsed,materialCode,materialName;
	IF finished = 1 THEN 
		CLOSE myCursor;
		LEAVE get_material;
	END IF;
	
	SELECT id into usedIdExist from `used_material` where no_bon = noBon and material_id = idMaterial;
	
	IF usedIdExist = -1 THEN
		IF luasOuter IS NOT NULL THEN
			set luasWidth=SUBSTRING_INDEX(luasOuter, 'x', 1);
			set luasHeight=SUBSTRING_INDEX(luasOuter, 'x', -1);
			set luasInt = luasWidth*luasHeight;
			INSERT INTO `used_material`(material_id,quantity,no_bon,material_code,material_name) values(idMaterial,materialQuantityUsed*orderItemQuantity*luasInt,noBon,materialCode,materialName);
		ELSE
			INSERT INTO `used_material`(material_id,quantity,no_bon,material_code,material_name) values(idMaterial,materialQuantityUsed*orderItemQuantity,noBon,materialCode,materialName);
		END IF;
	END IF;

END LOOP get_material;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `stocks_report`(IN `noBonLike` VARCHAR(30))
    NO SQL
BEGIN
	
	
		DECLARE finished_1 INTEGER DEFAULT 0;
		
		--
		DECLARE productId INT DEFAULT 0;
		DECLARE orderItemQuantity INT DEFAULT 0;
		DECLARE noBon VARCHAR(20);
		DECLARE luasOuter VARCHAR(50);
		--
		
		DECLARE myOrderCursor CURSOR FOR
		SELECT order_item.product_id as idProduct,order_item.quantity as quantityOrderItem,order.no_bon,order_item.luas from `order` join `order_item` on order.id=order_item.order_id where order.jumlah_bayar <> order.harga_bayar_fix and date(order.updated_at) = noBonLike and order.status_pengerjaan=2;	
		DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished_1 = 1;
		

		OPEN myOrderCursor;
		get_product: LOOP


		FETCH myOrderCursor INTO productId,orderItemQuantity,noBon,luasOuter;
		if finished_1 = 1 THEN
			CLOSE myOrderCursor;
			LEAVE get_product;	
		END IF;
		--
		call inner_loop_stocks_report(productId,orderItemQuantity,noBon,luasOuter);		
		--
		END LOOP get_product;
	

	
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
(1, NULL, '1', 0, NULL, NULL),
(2, NULL, '2', 0, NULL, NULL),
(3, NULL, '3', 0, NULL, NULL),
(4, NULL, '4', 0, NULL, NULL),
(5, NULL, '5', 0, NULL, NULL),
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
(1, 0);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `name`, `phone`, `email`, `membership_id`, `birthdate`) VALUES
(1, 'izal', '123', NULL, NULL, NULL),
(2, 'izal1', '1231', NULL, NULL, NULL);

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
(1, 'running text', 'WELCOME TO WIDJI');

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
(1, 'mat cod', 'mat name', 'hvs', 10, 'rim', 50);

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
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE IF NOT EXISTS `order` (
  `id` int(11) NOT NULL,
  `no_bon` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(5) NOT NULL,
  `name` varchar(50) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `tanggal_pengambilan` date DEFAULT NULL,
  `jam_pengambilan` time DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `jumlah_bayar` double NOT NULL,
  `discount` double DEFAULT NULL,
  `status_pengerjaan` int(11) NOT NULL,
  `worker` varchar(50) DEFAULT NULL,
  `laci` varchar(50) DEFAULT NULL,
  `harga_bayar_fix` double NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `no_bon`, `created_at`, `updated_at`, `status`, `name`, `customer_id`, `tanggal_pengambilan`, `jam_pengambilan`, `keterangan`, `jumlah_bayar`, `discount`, `status_pengerjaan`, `worker`, `laci`, `harga_bayar_fix`) VALUES
(1, '16422223410466', '2016-05-22 15:34:10', '2016-06-01 15:34:10', 0, 'izal', 1, NULL, NULL, NULL, 0, NULL, 2, NULL, NULL, 100),
(2, '164222322790', '2016-05-22 16:22:07', '2016-06-05 16:22:07', 0, 'izal1', 2, NULL, NULL, NULL, 4000, NULL, 2, NULL, NULL, 10000);

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE IF NOT EXISTS `order_item` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` double NOT NULL,
  `luas` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`id`, `product_id`, `order_id`, `quantity`, `price`, `luas`) VALUES
(1, 2, 1, 1, 100, '2x2'),
(2, 2, 2, 1, 50, '1x2');

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
  `weight` varchar(10) NOT NULL,
  `imgbase64` varchar(255) NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `category_id`, `media`, `size`, `status`, `weight`, `imgbase64`, `price`) VALUES
(2, 2, '2', '2', 1, '1', 'http://localhost/widji-server/assets/img/products/product_2_2_2_1_1.jpeg', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `product_material`
--

INSERT INTO `product_material` (`id`, `product_id`, `material_id`, `material_quantity_used`) VALUES
(1, 2, 1, 5);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id_session`, `session_code`, `id_user`) VALUES
(1, 'abc', 1);

-- --------------------------------------------------------

--
-- Table structure for table `stock_monitoring`
--

CREATE TABLE IF NOT EXISTS `stock_monitoring` (
  `id` int(11) NOT NULL,
  `no_bon` varchar(30) NOT NULL,
  `order_item_id` int(11) NOT NULL,
  `id_material` int(11) NOT NULL,
  `material_name` varchar(30) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `used_material`
--

CREATE TABLE IF NOT EXISTS `used_material` (
  `id` int(11) NOT NULL,
  `material_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `no_bon` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `material_code` varchar(50) NOT NULL,
  `material_name` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `used_material`
--

INSERT INTO `used_material` (`id`, `material_id`, `quantity`, `no_bon`, `created_at`, `material_code`, `material_name`) VALUES
(4, 1, 10, '164222322790', '2016-06-05 04:40:04', 'mat cod', 'mat name');

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
-- Indexes for table `used_material`
--
ALTER TABLE `used_material`
  ADD PRIMARY KEY (`id`), ADD KEY `material_id` (`material_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `product_category`
--
ALTER TABLE `product_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `product_material`
--
ALTER TABLE `product_material`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
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
  MODIFY `id_session` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `stock_monitoring`
--
ALTER TABLE `stock_monitoring`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `used_material`
--
ALTER TABLE `used_material`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
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
