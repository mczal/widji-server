var mysql = require('mysql');

function pay(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

pay.prototype.handleRoutes = function(router,connection){
  router.post('/pay',function(req,res){
    var sessionCode = req.body.sessionCode;
    var no_bon = req.body.no_bon;
    var jumlahBayar = req.body.jumlahBayar;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c rec"});
    }else{
      if(no_bon == null || no_bon == undefined || no_bon == ''){
        res.json({"message":"err.. no params n_b rec"});
      }else{
        if(jumlahBayar == null || jumlahBayar == undefined || jumlahBayar == ''){
          res.json({"message":"err.. no params j_b rec"});
        }else{
          var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
          connection.query(query,function(err,rows){
            if(err){
              res.json({"message":"err.. error on session","query":query});
            }else{
              if(rows.length == 1){
                if(rows[0].id_role == 2){
                  
                }else{
                  res.json({"message":"err.. you have no authorize to do this action"});
                }
              }else{
                res.json({"message":"err... rows length not equal to 1"});
              }
            }
          });
        }
      }
    }
  });
}

module.exports = pay;
