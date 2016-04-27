var mysql = require('mysql');

function associateOrderItemAndStocks(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

associateOrderItemAndStocks.prototype.handleRoutes = function(router,connection){
  router.post('/associateOrderItemAndStocks',function(req,res){
    var sessionCode = req.body.sessionCode;
    var idOrderItem = req.body.idOrderItem;
    var no_bon = req.body.no_bon;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c resc"});
    }else{
      if(idOrderItem == null || idOrderItem == undefined || idOrderItem == ''){
        res.json({"message":"err.. no params i_o_i resc"});
      }else{
        if(no_bon == null || no_bon == undefined || no_bon == ''){
          res.json({"message":"err.. no params n_b resc"});
        }else{
          var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
          connection.query(query,function(err,rows){
            if(err){
              res.json({"message":"err.. error on session","query":query});
            }else{
              if(rows.length == 1){
                if(rows[0].id_role == 2){
                  //eof template
                  //get quantity
                  var q1 = "select product_id,quantity from `order_item` where id="+idOrderItem;
                  connection.query(q1,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on q selecting quant and ip"});
                    }else{
                      if(rows.length>0){
                        var idProduct = rows[0].product_id;
                        var quantity = rows[0].quantity;
                        var outProc = 0;
                        var q2 = "CALL associate_orderItem_stock("+no_bon+","+idProduct+","+quantity+","+idOrderItem+")";
                        connection.query(q2,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on calling procedure","q2":q2});
                          }else{
                            res.json({"message":"Success","content":rows});
                          }
                        });
                      }else {
                        res.json({"message":"err.. no rows on given id"});
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
    }
  });
}

module.exports = associateOrderItemAndStocks;
