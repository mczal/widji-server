var mysql = require('mysql');

function getAllMemberType(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self= this;

getAllMemberType.prototype.handleRoutes = function(router,connection){
  router.post('/getAllMemberType',function(req,res){
    connection.query("select * from `membership`",function(err,rows){
      if(err){
        res.json({"m3ssage":"err.. error on selecting"});
      }else{
        if(rows.length>0){
          res.json({"message":"success","content":rows});
        }else{
          res.json({"message":"Err.. no rows"});
        }
      }
    });
  });
}

module.exports = getAllMemberType;
