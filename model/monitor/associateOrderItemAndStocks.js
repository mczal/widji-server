var mysql = require('mysql');

function associateOrderItemAndStocks(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

associateOrderItemAndStocks.prototype.handleRoutes = function(router,connection){
  router.post('/associateOrderItemAndStocks',function(req,res){
    var idOrderItem = req.body.idOrderItem;
    var no_bon = req.body.no_bon;
      if(idOrderItem == null || idOrderItem == undefined || idOrderItem == ''){
        res.json({"message":"err.. no params i_o_i resc"});
      }else{
        if(no_bon == null || no_bon == undefined || no_bon == ''){
          res.json({"message":"err.. no params n_b resc"});
        }else{
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
                var q2 = "CALL associate_orderItem_stock("+idProduct+","+quantity+","+idOrderItem+","+no_bon+")";
                connection.query(q2,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on calling procedure","q2":q2});
                  }else{
                    //SEKALIAN NGEMBALIIN STATUS -1 ??? KALO KURANG ??
                    // if(rows.length>0){
                      res.json({"message":"Success","param":{"no_bon":no_bon,"idProduct":idProduct,"quantity":quantity,"idOrderItem":idOrderItem},"content":rows});
                    //}else{
                    //   res.json({"message":"err.. no rows"});
                    // }
                  }
                });
              }else {
                res.json({"message":"err.. no rows on given id"});
              }
            }
          });
        }
      }

  });
}

module.exports = associateOrderItemAndStocks;
