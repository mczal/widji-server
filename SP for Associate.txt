DELIMITER $$
CREATE PROCEDURE associateOrderAndStocks(IN idProduct int , IN quantityz int)
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

	get_material: LOOP
 
		FETCH myCursor INTO idMaterial,materialQuantityUsed;

		IF finished = 1 THEN 
			LEAVE get_material;
		END IF;
		--
		SELECT quantity INTO tempQuantity, material_name INTO tempMaterialName  from `material` where id_material = idMaterial;
		IF tempQuantity < (materialQuantityUsed*quantityz) THEN
			INSERT INTO `stock_monitoring` (id_material,material_name,status)
			VALUES (idMaterial,tempMaterialName,-1);
		ELSE
			UPDATE `material` SET quantity = tempQuantity-materialQuantityUsed where id_material = idMaterial;
				
			INSERT INTO `stock_monitoring` (id_material,material_name,status)
			VALUES (idMaterial,@tempMaterialName,1);
		END IF;

    END LOOP get_material;
	
	CLOSE myCursor;

END$$
DELIMITER ;