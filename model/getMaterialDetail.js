var mysql = require('mysql');

function getMaterialDetail(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getMaterialDetail.prototype.handleRoutes = function(router,connection){
  router.post('/getMaterialDetail',functionl(req,res){
    var idMaterial = req.body.idMaterial;
    if(idMaterial==null || idMaterial==undefined || idMaterial==""){
      res.json({"message":"err.. error no params"});
    }else{
      connection.query("select * from `material` where id_material="+idMaterial,function(err,rows){
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
    }
  });
}

module.exports = getMaterialDetail;
