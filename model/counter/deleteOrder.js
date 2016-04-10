var mysql = require('mysql');

function deleteOrder(router,connection,md5){
  var self=this;
  self.handleRoutes(router,connection,md5);
}

var self=this;

deleteOrder.prototype.handleRoutes = function(router,connection,md5){
  router.post('/deleteOrder',function(req,res){
    var sessionCode = req.body.sessionCode;
    var no_bon = req.body.no_bon;
    var passAdmin = req.body.passAdmin;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c rec"});
    }else{
      if(no_bon == null || no_bon == undefined || no_bon == ''){
        res.json({"message":"err.. no params n_b rec"});
      }else{
        if(passAdmin == null || passAdmin == undefined || passAdmin == ''){
          res.json({"message":"err.. no params p_a rec"});
        }else{
          var q123 = "select id_role from `user` where password='"+md5(passAdmin)+"'";
          connection.query(q123,function(err,rows){
            if(err){
              res.json({"message":"err.. error on check p_a qry"});
            }else{
              if(rows.length>0){
                //role = 1 => admin
                if(rows[0].id_role == 1){
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
                }else{
                  res.json({"message":"err.. p_a authentication failed"});
                }
              }else{
                res.json({"message":"err.. no rows on usr while p_a c"});
              }
            }
          });
        }
      }
    }
  });
}

module.exports = deleteOrder;
