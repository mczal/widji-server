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
	

	
END