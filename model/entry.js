var mysql = require("mysql");

function entry(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

entry.prototype.handleRoutes=function(router,connection){

  router.post("/newEntry",function(req,res){
    var catName = req.body.category;
    if(catName==null || catName==undefined || catName==""){
      res.json({"message":"err.. error no catName req received"});
    }else{
      connection.query("select id_cat from `category` where cat_name = '"+catName+"'",function(err,rows){
        if(err){
          res.json({"message":"err... error in lookup category"});
        }else{
          if(rows.length>0){
            var idCat = rows[0].id_cat;
            connection.query("select value from `last_entry_cat_queue` where id_cat = "+idCat,function(err,rows){
              if(err){
                res.json({"message":"err... in lookup last_entry_cat"});
              }else{
                if(rows.length>0){
                  var lastEntry = rows[0].value;
                  var query = "insert into `queue_rtn` (queue_number,id_cat,statusz) values(?,?,?)";
                  var table = [(lastEntry+1),idCat,0];
                  query = mysql.format(query, table);
                  connection.query(query,function(err,rows){
                    if(err){
                      res.json({"message":"err... error in inserting new queue_rtn"});
                    }else{
                      connection.query("UPDATE `last_entry_cat_queue` SET value="+(lastEntry+1)+" WHERE id_cat="+idCat,function(err,rows){
                        if(err){
                          res.json({"message":"err... error in updaeting last_entry_queue"});
                        }else{
                          res.json({"message":"Success congrats bray","nomor_antrian":(lastEntry+1),"category":catName});
                        }
                      });
                    }
                  });
                }else{
                  res.json({"message":"err... rows kosong - no result di last_entry_cat_queue"});
                }
              }
            });
          }else{
            res.json({"message":"err... rows kosong - no result di category"});
          }
        }
      });
    }
  });

}

module.exports=entry;
