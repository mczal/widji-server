var mysql = require('mysql');

function deleteOrder(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

deleteOrder.prototype.handleRoutes = function(router,connection){
  router.post('/deleteOrder',function(req,res){
    var sessionCode = req.body.sessionCode;
    var no_bon = req.body.no_bon;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c rec"});
    }else{
      if(no_bon == null || no_bon == undefined || no_bon == ''){
        res.json({"message":"err.. no params n_b rec"});
      }else{
        var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
        connection.query(query,function(err,rows){
          if(err){
            res.json({"message":"err.. error on session","query":query});
          }else{
            if(rows.length == 1){
              if(rows[0].id_role == 2){
                connection.query("select id as id_order from `order` where no_bon='"+no_bon+"'",function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on selecting id_h"});
                  }else{
                    if(rows.length>0){
                      var idOrder = rows[0].id_order;
                      //delete di order_itemnya...
                      connection.query("delete from `order_item` where order_id="+idOrder,function(er,rows){
                        if(err){
                          res.json({"message":"err.. error on deleting order item","err":err});
                        }else{
                          connection.query("delete from `order` where id="+idOrder,function(err,rows){
                            if(err){
                              res.json({"message":"err.. error on deleting order","err":err});
                            }else{
                              res.json({"message":"success deleting","error":"success"});
                            }
                          });
                        }
                      });
                    }else{
                      res.json({"message":"err.. no rows on order"});
                    }
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

module.exports = deleteOrder;
