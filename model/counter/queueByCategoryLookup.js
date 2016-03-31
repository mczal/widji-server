var mysql=require("mysql");

function queueByCategoryLookup(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this; // <<-- ini untuk apa ya ?

queueByCategoryLookup.prototype.handleRoutes=function(router,connection){
  router.post("/queueByCategoryCount",function(req,res){
    connection.query("SELECT id_cat from `category`",function(err,rowsCat){
      if(err){
        res.json({"message":"err.. error in lookup category"});
      }else{
        if(rowsCat.length>0){
          connection.query("SELECT count(id_queue) as a FROM `queue_rtn` WHERE statusz=0 and id_cat="+rowsCat[0].id_cat,function(err,rows){
            if(err){
              res.json({"message":"err.. error in lookup queue from given cat bfr ~a"});
            }else{
              if(rows.length>0){
                var a=rows[0].a;
                connection.query("SELECT count(id_queue) as b FROM `queue_rtn` WHERE statusz=0 and id_cat="+rowsCat[1].id_cat,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error in lookup queue from given cat bfr ~b"});
                  }else{
                    if(rows.length>0){
                      var b=rows[0].b;
                      connection.query("SELECT count(id_queue) as c FROM `queue_rtn` WHERE statusz=0 and id_cat="+rowsCat[2].id_cat,function(err,rows){
                        if(err){
                          res.json({"message":"err.. error in lookup queue from given cat bfr ~c"});
                        }else{
                          if(rows.length>0){
                            var c=rows[0].c;
                            res.json({"message":"success bro congrats!","a":a,"b":b,"c":c});
                          }else{
                            res.json({"message":"err.. no rows in c"});
                          }
                        }
                      });
                    }else{
                      res.json({"message":"err.. no rows in b"});
                    }
                  }
                });
              }else{
                res.json({"message":"err.. no rows in a"});
              }
            }
          });
        }else{
          res.json({"message":"err.. no rows in category"});
        }
      }
    });
  });
}

module.exports=queueByCategoryLookup;
