var mysql = require('mysql');

function addNewType(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

addNewType.prototype.handleRoutes = function(router,connection){
  router.post('/addNewType',function(req,res){
    var session = req.body.session;
    var kodeBahan = req.body.kodeBahan;
    var namaBahan = req.body.namaBahan;
    var unit = req.body.unit;
    var ukuranPerUnit = req.body.ukuranPerUnit;
    var jumlahStok = req.body.jumlahStok;
    var satuan = req.body.satuan;
    if(kodeBahan == null || kodeBahan==undefined || kodeBahan==""){
      res.json({"message":"err.. no params kodeBahan received"});
    }else{
      if(namaBahan == null || namaBahan==undefined || namaBahan==""){
        res.json({"message":"err.. no params namaBahan received"});
      }else{
        if(unit == null || unit==undefined || unit==""){
          res.json({"message":"err.. no params unit received"});
        }else{
          if(ukuranPerUnit == null || ukuranPerUnit==undefined || ukuranPerUnit==""){
            res.json({"message":"err.. no params ukuranPerUnit received"});
          }else{
            if(jumlahStok == null || jumlahStok==undefined || jumlahStok==""){
              res.json({"message":"err.. no params jumlahStok received"});
            }else{
              if(satuan == null || satuan==undefined || satuan==""){
                res.json({"message":"err.. no params satuan received"});
              }else{
                if(session==null || session==undefined || session==""){
                  res.json({"message":"err.. no params rec"});
                }else{
                  connection.query("select id_user from `session` where session_code='"+session+"'",function(err,rows){
                    if(err){
                      res.json({"message":"err.. error on selecting session"});
                    }else{
                      if(rows.length>0){
                        var idUser = rows[0].id_user;
                        //
                        connection.query("select id_role from `user` where id_user="+idUser,function(err,rows){
                          if(err){
                            res.json({"message":"err.. error on selecting user"});
                          }else{
                            if(rows.length>0){
                              var idRole = rows[0].id_role;
                              //
                              connection.query("select role_name from `role` where id_role="+idRole,function(err,rows){
                                if(err){
                                  res.json({"message":"err.. error on selecting role"});
                                }else{
                                  if(rows.length>0){
                                    var roleName = rows[0].role_name;
                                    if(roleName == 'admin'){
                                      
                                    }else{
                                      res.json({"message":"err.. do not authorize"});
                                    }
                                  }else{
                                    res.json({"message":"err.. error no role registered"});
                                  }
                                }
                              });
                            }else{
                              res.json({"message":"err.. error no user registered"});
                            }
                          }
                        });
                      }else{
                        res.json({"message":"err.. error no session registered"});
                      }
                    }
                  });
                }
              }
            }
          }
        }
      }
    }
  });
}

module.exports = addNewType;
