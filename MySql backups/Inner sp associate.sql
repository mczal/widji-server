BEGIN


DECLARE idMaterial INT DEFAULT 0;
DECLARE usedIdExist INT DEFAULT -1;
DECLARE materialQuantityUsed INT DEFAULT 0;
DECLARE luasWidth INT DEFAULT 0;
DECLARE luasHeight INT DEFAULT 0;
DECLARE luasInt INT DEFAULT 0;	
DECLARE finished INTEGER DEFAULT 0;
DECLARE myCursor CURSOR FOR SELECT DISTINCT material_id,material_quantity_used from `product_material` where product_id = productId;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;			
OPEN myCursor;
			
get_material: LOOP
	set usedIdExist = -1;
	FETCH myCursor INTO idMaterial,materialQuantityUsed;
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
			INSERT INTO `used_material`(material_id,quantity,no_bon) values(idMaterial,materialQuantityUsed*orderItemQuantity*luasInt,noBon);
		ELSE
			INSERT INTO `used_material`(material_id,quantity,no_bon) values(idMaterial,materialQuantityUsed*orderItemQuantity,noBon);
		END IF;
	END IF;

END LOOP get_material;

END