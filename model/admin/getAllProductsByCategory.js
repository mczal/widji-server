var mysql = require('mysql');

function getAllProductsByCategory(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getAllProductsByCategory.prototype.handleRoutes = function(router,connection){
  router.post('/getAllProductsByCategory',function(req,res){
    var idCategory = req.body.idCategory;
    if(idCategory == null || idCategory == undefined || idCategory == ''){
      res.json({"message":"err.. no params received"});
    }else{
      var query = "select product.id,product_category.name,media,size,status,weight,imgbase64,product.price from `product` join `product_category` on product.category_id=product_category.id where product.category_id="+idCategory+" order by product.category_id asc, product.status desc";
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
    }
  });
}

module.exports = getAllProductsByCategory;
