var mysql = require("mysql");

function display(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self = this;

display.prototype.handleRoutes=function(router,connection){
  router.post("/display",function(req,res){
    connection.query("select id_queue from `last_display_queue` order by id_display asc",function(err,rowsD){
      if(err){
        res.json({"message":"err.. error on select lastdispQ"});
      }else{
        if(rowsD.length>0){
          connection.query("select queue_number,id_cat,id_counter from `queue_rtn` where id_queue="+rowsD[0].id_queue,function(err,rows){
            if(err){
              res.json({"message":"err.. error lookup in queuertn query"});
            }else{
              if(rows.length>0){
                var queueNum1 = rows[0].queue_number;
                var idCat1 = rows[0].id_cat;
                var idCounter1 = rows[0].id_counter;
                connection.query("select cat_name from `category` where id_cat="+idCat1,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error in lookup category 1"});
                  }else{
                    if(rows.length>0){
                      var catName1=rows[0].cat_name;
                      //MISSING nama counter di override oleh id counter , karena selama ini masih sama...
                      //---^^^
                      if(rowsD.length>1){
                        connection.query("select queue_number,id_cat,id_counter from `queue_rtn` where id_queue="+rowsD[1].id_queue,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error in query select queuertn 2"});
                          }else{
                            if(rows.length>0){
                              var queueNum2 = rows[0].queue_number;
                              var idCat2 = rows[0].id_cat;
                              var idCounter2 = rows[0].id_counter;
                              connection.query("select cat_name from `category` where id_cat="+idCat2,function(err,rows){
                                if(err){
                                  res.json({"message":"err.. error in query select from category 2"});
                                }else{
                                  if(rows.length>0){
                                    var catName2 = rows[0].cat_name;
                                    //MISSING nama counter di override oleh id counter , karena selama ini masih sama...
                                    //---^^^
                                    if(rowsD.length>2){
                                      connection.query("select queue_number,id_cat,id_counter from `queue_rtn` where id_queue="+rowsD[2].id_queue,function(err,rows){
                                        if(err){
                                          res.json({"message":"err.. error in query queuertn 3"});
                                        }else{
                                          if(rows.length>0){
                                            var queueNum3 = rows[0].queue_number;
                                            var idCat3 = rows[0].id_cat;
                                            var idCounter3 = rows[0].id_counter;
                                            connection.query("select cat_name from `category` where id_cat="+idCat3,function(err,rows){
                                              if(err){
                                                res.json({"message":"err.. error in query select category 3"});
                                              }else{
                                                if(rows.length>0){
                                                  var catName3 = rows[0].cat_name;
                                                  //MISSING nama counter di override oleh id counter , karena selama ini masih sama...
                                                  //---^^^
                                                  res.json({"message":"success congrats bro",
                                                    "count":"3",
                                                    "nomor_antrian_1":queueNum1,
                                                    "category_1":catName1,
                                                    "counter_1":idCounter1,
                                                    "nomor_antrian_2":queueNum2,
                                                    "category_2":catName2,
                                                    "counter_2":idCounter2,
                                                    "nomor_antrian_3":queueNum3,
                                                    "category_3":catName3,
                                                    "counter_3":idCounter3
                                                  });
                                                }else{
                                                  res.json({"message":"err.. no rows in category 3"});
                                                }
                                              }
                                            });
                                          }else{
                                            res.json({"message":"err.. no rows in queuertn 3"});
                                          }
                                        }
                                      });
                                    }else{
                                      //rowsD.length <=2
                                      res.json({"message":"success congrats bro",
                                        "count":"2",
                                        "nomor_antrian_1":queueNum1,
                                        "category_1":catName1,
                                        "counter_1":idCounter1,
                                        "nomor_antrian_2":queueNum2,
                                        "category_2":catName2,
                                        "counter_2":idCounter2
                                      });
                                    }
                                  }else{
                                    res.json({"message":"err.. no rows in lookup category 2"});
                                  }
                                }
                              });
                            }else{
                              res.json({"message":"err.. no rows in queuertn 2"});
                            }
                          }
                        });
                      }else{
                        //rowsD.length <=1
                        res.json({"message":"success congrats bro",
                          "count":"1",
                          "nomor_antrian_1":queueNum1,
                          "category_1":catName1,
                          "counter_1":idCounter1
                        });
                      }
                    }else{
                      res.json({"message":"err.. no rows in category 1"});
                    }
                  }
                });
              }else{
                res.json({"message":"err.. no rows , no such id given"});
              }
            }
          });
        }else{
          res.json({"message":"no rowsD display"});
        }
      }
    });
  });
}

module.exports=display;
