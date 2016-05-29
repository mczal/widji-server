var mysql = require('mysql');

function getProductDetail(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

getProductDetail.prototype.handleRoutes = function(router,connection){
  router.post('/getProductDetail',function(req,res){
    var idProduct = req.body.idProduct;
    if(idProduct == null || idProduct == undefined || idProduct == ''){
      res.json({"message":"err.. no params received"});
    }else{
      var q1 = "select product.id as id_product,product_category.id as category_id,product.media as media,product.size as size,product.status as product_status,product.weight as weight,product.imgbase64 as product_img,product.price as product_price from `product` join `product_category` on product.category_id=product_category.id where product.id="+idProduct;
      connection.query(q1,function(err,rows){
        if(err){
          res.json({"message":"err.. error on selecting","q1":q1});
        }else{
          if(rows.length>0){
            // var categoryName = rows[0].category_name;
            var categoryId = rows[0].category_id;
            var productMedia = rows[0].media;
            var productSize = rows[0].size;
            var productStatus = rows[0].product_status;
            var productWeight = rows[0].weight;
            var productImg = rows[0].product_img;
            var productPrice = rows[0].product_price;
            connection.query("select material.id_material,material.material_code,material.material_name,material.smallest_unit,material.stock_per_unit,material.unit_name,material.quantity,product_material.material_quantity_used from `material` join `product_material` on material.id_material=product_material.material_id where product_material.product_id="+idProduct,function(err,rows){
              if(err){
                res.json({"message":"err.. error on selcting"});
              }else{
                res.json({"message":"success on selecting","error":"success","idProduct":idProduct,"categoryId":categoryId,"productMedia":productMedia,"productSize":productSize,"productStatus":productStatus,"productWeight":productWeight,"productImg":productImg,"productPrice":productPrice,"content":rows});
              }
            });
          }else{
            res.json({"message":"err.. no rows"});
          }
        }
      });
    }
  });
}

module.exports = getProductDetail;
