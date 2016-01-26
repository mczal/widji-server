var mysql = require("mysql");

function recall(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

recall.prototype.handleRoutes=function(router,connection){
  router.post("/recall",function(req,res){
    var myIp = req.body.myIp;
    if(myIp==null || myIp==undefined || myIp==""){
      res.json({"message":"no param"});
    }else{
      connection.query("select id_queue,id_counter from `counter` where ip_addrs='"+myIp+"'",function(err,rows){
        if(err){
          res.json({"message":"err.. error in query select from counter"});
        }else{
          if(rows.length>0){
            var idQRtn = rows[0].id_queue;
            var idCounterC = rows[0].id_counter;
            connection.query("select queue_number,id_cat from `queue_rtn` where id_queue="+idQRtn+" and id_counter="+idCounterC,function(err,rows){
              if(err){
                res.json({"message":"err.. error in query select queuertn"+idQRtn+" "+idCounterC});
              }else{
                if(rows.length>0){
                  var queueNum = rows[0].queue_number;
                  var idCat = rows[0].id_cat;
                  connection.query("select cat_name from `category` where id_cat="+idCat,function(err,rows){
                    if(err){
                      res.json({"message":"err.. error in query select category"});
                    }else{
                      if(rows.length>0){
                        var catName = rows[0].cat_name;
                        res.json({"message":"Success bro congrats","nomor_antrian":queueNum,"category":catName});
                      }else{
                        res.json({"message":"err.. no rows in category given idcat"});
                      }
                    }
                  });
                }else{
                  res.json({"message":"err.. no rows in qrtn from given idqrtn and idCOunter"});
                }
              }
            });
          }else{
            res.json({"message":"err.. no rows from given ip"});
          }
        }
      });
    }
  });
}

module.exports=recall;
