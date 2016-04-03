var mysql = require('mysql');

function getAllOrderItem(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getAllOrderItem.prototype.handleRoutes = function(router,connection){
  router.post('/getAllOrderItem',function(req,res){
    var sessionCode = req.body.sessionCode;
    var no_bon = req.body.no_bon;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params received."});
    }else{
      if(no_bon == null || no_bon == undefined || no_bon == ''){
        res.json({"message":"err.. no params received,"});
      }else{
        var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on selecting role"});
          }else{
            if(rows.length>0){
              if(rows.length==1){
                // role kasir adalah role counter juga... = 2
                if(rows[0].id_role == 2){
                  var q = "select order.name,product_category.name,product.media,product.size,product.status,product.weight,product.imgbase64,order_item.quantity,order.jumlah_bayar from `order` join `order_item` on order.id=order_item.order_id join `product` on order_item.product_id=product.id join `product_category` on product.category_id=product_category.id where order.no_bon = '"+no_bon+"'";
                  connection.query(q,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on selecting","error":"error"});
                    }else{
                      res.json({"message":"success selecting","error":"success","count":rows.length,"content":rows});
                    }
                  });
                }else{
                  res.json({"message":"err.. not authorized"});
                }
              }else{
                res.json({"message":"rows.length > 1 !","rows":rows,"error":"error"});
              }
            }else{
              res.json({"message":"err.. no rows"});
            }
          }
        });
      }
    }
  });
}

module.exports = getAllOrderItem;
