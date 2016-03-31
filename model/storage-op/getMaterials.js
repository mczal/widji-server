var mysql = require('mysql');

function getMaterials(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getMaterials.prototype.handleRoutes = function(router,connection){
  router.post('/getMaterials',function(req,res){
    connection.query("select * from `material`",function(err,rows){
      if(err){
        res.json({"message":"err.. error on selecting material"});
      }else{
        if(rows.length>0){
          res.json(rows);
        }else{
          res.json({"message":"err.. no rows"});
        }
      }
    });
  });
}

module.exports = getMaterials;
