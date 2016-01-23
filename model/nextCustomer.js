var mysql = require("mysql");

function nextCustomer(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self = this;

nextCustomer.prototype.handleRoutes=function(router,connection){
  router.post("/nextCustomer",function(req,res){
    var catName = req.body.category;
    var ipCounter = req.body.myIp;
    if(catName==null || catName==undefined || catName==""){
      res.json({"message":"err.. error no catName req received"});
    }else{
      if(ipCounter==null || ipCounter==undefined || ipCounter==""){
        res.json({"message":"err.. error no ip req received"});
      }else{
        //here
        connection.query("select id_cat from `category` where cat_name='"+catName+"'",function(err,rows){
          if(err){
            res.json({"message":"err... error in lookup category"});
          }else{
            if(rows.length>0){
              var idCat = rows[0].id_cat;
              connection.query("select id_counter from `counter` where ip_addrs='"+ipCounter+"'",function(err,rows){
                if(err){
                  res.json({"message":"err.. error in lookup idCt with ipAddrss"});
                }else{
                  if(rows.length>0){
                    var idCounter = rows[0].id_counter;
                    connection.query("SELECT id_queue,queue_number,statusz FROM queue_rtn WHERE statusz=0 and id_cat="+idCat+" ORDER BY queue_number asc LIMIT 1 ",function(err,rows){
                      if(err){
                        res.json({"message":"err.. error in lookup from queuertn with given id_cat"});
                      }else{
                        if(rows.length>0){
                          var qNum = rows[0].queue_number;
                          var idQRtn = rows[0].id_queue;
                          connection.query("update `queue_rtn` set statusz=1,id_counter="+idCounter+" where id_queue="+idQRtn+" and queue_number="+qNum,function(err,rows){
                            if(err){
                              res.json({"message":"err.. error in updating queueRoutine"});
                            }else{
                              connection.query("select value from `last_entry_counter_queue` where id_counter="+idCounter,function(err,rows){
                                if(err){
                                  res.json({"message":"err.. error in selecting lastval from lastentrycounterqueue"});
                                }else{
                                  if(rows.length>0){
                                    var lastVal = rows[0].value;
                                    connection.query("update `last_entry_counter_queue` set value="+(lastVal+1)+" where id_counter="+idCounter,function(err,rows){
                                      if(err){
                                        res.json({"message":"err.. error in updating lastentrycounterqueue"});
                                      }else{
                                        connection.query("update `counter` set id_queue="+idQRtn+" where id_counter="+idCounter,function(err,rows){
                                          if(err){
                                            res.json({"message":"err.. error in update counter serving queue"});
                                          }else{
                                            connection.query("select value from `count_display`",function(err,rows){
                                              if(err){
                                                res.json({"message":"err.. error lookup value from count_display"});
                                              }else{
                                                if(rows.length>0){
                                                  var value=rows[0].value;
                                                  var query="";
                                                  if((value+1)>3){
                                                    query = "update `last_display_queue` set id_queue="+idQRtn+" where id_display="+((value+1)%3)+"";
                                                  }else{
                                                    query = "insert into `last_display_queue` (id_queue) values ("+idQRtn+")";
                                                  }
                                                  connection.query(query,function(err,rows){
                                                    if(err){
                                                      res.json({"message":"err.. error in query -> "+query});
                                                    }else{
                                                      connection.query("update `count_display` set value="+(value+1)+" where id_count_display=1",function(err,rows){
                                                        if(err){
                                                          res.json({"message":"err.. error updating count display value"});
                                                        }else{
                                                          res.json({"message":"Success bro congrats","nomor_antrian":qNum,"category":catName});
                                                        }
                                                      });
                                                    }
                                                  });
                                                }else{
                                                  res.json({"message":"err.. no rows in countDisplay"});
                                                }
                                              }
                                            });
                                          }
                                        });
                                      }
                                    });
                                  }else{
                                    res.json({"message":"err.. no rows in selecting lastval from lastentrycounterqueue"});
                                  }
                                }
                              });
                            }
                          });
                        }else{
                          res.json({"message":"err.. no rows match in queuertn from lookup activity"});
                        }
                      }
                    });
                  }else{
                    res.json({"message":"err.. no rows in counter with ipAddrs given"});
                  }
                }
              });
            }else{
              res.json({"message":"err.. no rows match in category from lookup activity"});
            }
          }
        });
      }
    }
  });
}

module.exports=nextCustomer;
