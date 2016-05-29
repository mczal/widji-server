function removeProduct(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

removeProduct.prototype.handleRoutes = function(router,connection){
  router.post('/removeProduct',function(req,res){
    var sessionCode = req.body.sessionCode;
    var idProduct = req.body.idProduct;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no param s_c rec"});
    }else{
      if(idProduct == null || idProduct == undefined || idProduct == ''){
        res.json({"message":"err.. no param i_p rec"});
      }else{
        var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on session","query":query});
          }else{
            if(rows.length == 1){
              if(rows[0].id_role == 1){
                var q1 = "delete from `order_item` where product_id="+idProduct;
                var q2 = "delete from `product_material` where product_id="+idProduct;
                var q3 = "delete from `product` where id="+idProduct;
                connection.query(q1,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on deleting order_item q"});
                  }else{
                    connection.query(q2,function(err,rows){
                      if(err){
                        res.json({"message":"err.. error on deleting product_material q"});
                      }else{
                        connection.query(q3,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on deleting product q"});
                          }else{
                            res.json({"message":"success on deleting product"});
                          }
                        });
                      }
                    });
                  }
                });
              }else{
                res.json({"message":"err.. you have no authorize to do this action"});
              }
            }else{
              res.json({"message":"err... rows length not equal to 1"});
            }
          }
        });
      }
    }
  });
}

module.exports = removeProduct;
