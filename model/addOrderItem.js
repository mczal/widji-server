var mysql = require('mysql');

function addOrderItem(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

addOrderItem.prototype.handleRoutes = function(router,connection){
  router.post('/addOrderItem',function(req,res){
    var sessionCode = req.body.sessionCode;
    var no_bon = req.body.no_bon;
    var idProduct = req.body.idProduct;
    var quantity = req.body.quantity;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params sess received"});
    }else{
      if(no_bon == null || no_bon == undefined || no_bon == ''){
        res.json({"message":"err.. no params no_bon received"});
      }else{
        if(idProduct == null || idProduct == undefined || idProduct == ''){
          res.json({"message":"err.. no params idProduct received"});
        }else{
          if(quantity == null || quantity == undefined || quantity == '' || quantity < 1 ){
            res.json({"message":"err.. no params quantity rec"});
          }else{
            //here
            //select id bon
            connection.query("select id from `order` where no_bon='"+no_bon+"'",function(err,rows){
              if(err){
                res.json({"message":"err.. error select from order"});
              }else{
                if(rows.length>0){
                  var idBon = rows[0].id;
                  //here
                  var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
                  connection.query(query,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on selecting session","query":query});
                    }else{
                      if(rows.length>0){
                        if(rows.length==1){
                          if(rows[0].id_role == 2){
                            connection.query("insert into `order_item`(product_id,order_id,quantity) values("+idProduct+","+idBon+","+quantity+")",function(err,rows){
                              if(err){
                                res.json({"message":"err.. error in inserting order item"});
                              }else{
                                res.json({"message":"success","error":"success"});
                              }
                            });
                          }else{
                            res.json({"message":"err.. don't have authorize to do this action"});
                          }
                        }else{
                          res.json({"message":"rows.length > 1 !","rows":rows,"error":"error"});
                        }
                      }else{
                        res.json({"message":"err.. no rows"});
                      }
                    }
                  });
                }else{
                  res.json({"message":"err.. no rows"});
                }
              }
            });
          }
        }
      }
    }
  });
}

module.exports = addOrderItem;
