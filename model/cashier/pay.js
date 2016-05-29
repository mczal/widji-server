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
                if(rows[0].id_role == 2 || rows[0].id_role == 1){
                   //STEP 1. select jumlah bayar di order_id
                   connection.query("select jumlah_bayar from `order` where no_bon='"+no_bon+"'",function(err,rows){
                     if(err){
                       res.json({"message":"err.. error on selecting j_b"});
                     }else{
                       if(rows.length>0){
                         var q1 = "-1";
                         var status = "null";
                         var hargaBayar = rows[0].jumlah_bayar;
                         //1.1 cek jika DP...
                         if(jumlahBayar<hargaBayar){
                           //maka ini DP
                           q1 = "update `order` set jumlah_bayar="+((hargaBayar*1)-(jumlahBayar*1))+" where no_bon='"+no_bon+"'";
                           status = "DP";
                         }else if(jumlahBayar == hargaBayar){
                           //Lunas
                           q1 = "update `order` set jumlah_bayar=0, status=1 where no_bon='"+no_bon+"'";
                           status = "LUNAS";
                         }else{
                           //LEBIH BAYARNYA WOI...
                           res.json({"message":"err.. jumlah_bayar > harga_bayar"});
                         }
                       }else{
                         res.json({"message":"err.. no rows on j_b00"});
                       }

                       if(q1 != "-1"){
                         connection.query(q1,function(err,rows){
                           if(err){
                             res.json({"message":"err.. error on updating","q1":q1});
                           }else{
                             res.json({"message":"success updating order","status":status});
                           }
                         });
                       }
                     }
                   });
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
