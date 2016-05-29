var mysql = require('mysql');

function deleteItemOrder(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

deleteItemOrder.prototype.handleRoutes = function(router,connection){
  router.post('/deleteItemOrder',function(req,res){
    var sessionCode = req.body.sessionCode;
    var no_bon = req.body.no_bon;
    var idOrderItem = req.body.idOrderItem;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.s. no params received","error":"error"});
    }else{
      if(no_bon == null || no_bon == undefined || no_bon == ''){
        res.json({"message":"err.n_b. no params received","error":"error"});
      }else{
        if(idOrderItem == null || idOrderItem == undefined || idOrderItem == ''){
          res.json({"message":"err.i_o_i. no params received","error":"error"});
        }else{
          //STEP 1. get price order_item want to delete
          var q1 = "select order_item.price as price from `order_item` where order_item.id="+idOrderItem;
          connection.query(q1,function(err,rows){
            if(err){
              res.json({"message":"err.. err on q1","q1":q1,"error":"error"});
            }else{
              if(rows.length>0){
                var itemPrice = rows[0].price;
          //STEP 2. delete order_item with spesifik id
                var q2 = "delete from `order_item` where order_item.id="+idOrderItem;
                connection.query(q2,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on deleting","q2":q2,"error":"error"});
                  }else{
          //STEP 3. get jumlah bayar dulu
                    var q3 = "select jumlah_bayar from `order` where no_bon='"+no_bon+"'";
                    connection.query(q3,function(err,rows){
                      if(err){
                        res.json({"message":"err.. error on selecting old total","error":"error"});
                      }else{
                        if(rows.length>0){
                          var oldTotalPrice = rows[0].jumlah_bayar;
          //STEP 4. update jumlah bayar on order
                          var q4 = "update `order` set harga_bayar_fix="+updatedPrice+",jumlah_bayar="+((oldTotalPrice*1)-(itemPrice*1))+" where no_bon='"+no_bon+"'";
                          connection.query(q4,function(err,rows){
                            if(err){
                              res.json({"message":"err.. error on updating order","error":"error"});
                            }else{
                              res.json({"message":"success deleting and updating order","error":"success"});
                            }
                          });
                        }else{
                          res.json({"message":"err.. error no rows on order old total","error":"error"});
                        }
                      }
                    });
                  }
                });
              }else{
                res.json({"message":"err.. error no rows price","error":"error"});
              }
            }
          });
        }
      }
    }
  });
}

module.exports = deleteItemOrder;
