var mysql = require('mysql');

function getAllProducts(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getAllProducts.prototype.handleRoutes = function(router,connection){
  router.post('/getAllProducts',function(req,res){
    var query = "select product.id,product_category.name,media,size,status,weight,imgbase64 from `product` join `product_category` on product.category_id=product_category.id order by product.category_id asc, product.status desc";
    connection.query(query,function(err,rows){
      if(err){
        res.json({"message":"err.. error on selectiong products","query":query});
      }else{
        if(rows.length>0){
          res.json(rows);
        }else{
          res.json({"message":"err.. no rows"});
        }
      }
    });
  });
}

module.exports = getAllProducts;
