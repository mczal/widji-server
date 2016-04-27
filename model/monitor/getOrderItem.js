var mysql = require('mysql');

function getOrderItem(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getOrderItem.prototype.handleRoutes = function(router,connection){
  router.post('/getOrderItem',function(req,res){
    var no_bon = req.body.no_bon;
    if(no_bon == null || no_bon == undefined || no_bon == ''){
      res.json({"message":"err.. no params received."});
    }else{
      var query = "select order_item.id as id_order_item,product.id as id_product,product_category.name,product.media,product.size,product.weight,order_item.quantity,order_item.price from `order` join `order_item` on order.id=order_item.order_id join `product` on order_item.product_id=product.id join `product_category` on product.category_id=product_category.id where order.no_bon = '"+no_bon+"'";
      connection.query(query,function(err,rows){
        if(err){
          res.json({"message":"err.. error on selecting query"});
        }else{
          if(rows.length>0){
            res.json({"message":"success selecting","content":rows});
          }else{
            res.json({"message":"err.. no rows","quer":query});
          }
        }
      });
    }
  });
}

module.exports = getOrderItem;
