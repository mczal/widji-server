var mysql = require('mysql');

function discountMember(router,connection){
    var self=this;
    self.handleRoutes(router,connection);
}
//KALO...UDH SEKALI DIDISKON>>>BERARTI GABOLEH LAGI LAGI DISKON YAA TODO:
discountMember.prototype.handleRoutes = function(router,connection){
  router.post('/discountMember',function(req,res){
    var sessionCode = req.body.sessionCode;
    var no_bon = req.body.no_bon;
    var membershipCode = req.body.membershipCode;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no params s_c rec"});
    }else{
      if(no_bon == null || no_bon == undefined || no_bon == ''){
        res.json({"message":"err.. no params n_b rec"});
      }else{
        if(membershipCode == null || membershipCode == undefined || membershipCode == ''){
          res.json({"message":"err.. no params m_c rec"});
        }else{
          var query = "select role.id_role as id_role from `session` join `user` on session.id_user=user.id_user join role on role.id_role=user.id_role where session.session_code='"+sessionCode+"'";
          connection.query(query,function(err,rows){
            if(err){
              res.json({"message":"err.. error on session","query":query});
            }else{
              if(rows.length == 1){
                if(rows[0].id_role == 2 || rows[0].id_role == 1){
                  var q012 = "select discount,no_bon from `order` where no_bon='"+no_bon+"'";
                  connection.query(q012,function(err,rows){
                    if(err){
                      res.json({"message":"err.. on selecting disc st1"});
                    }else{
                      if(rows.length>0){
                        if(rows[0].discount == null || rows[0].discount == undefined || rows[0].discount == ''){
                          //ambil jumlah discount dulu di membership code
                          var q2 = "select discount from `membership` where membership_code='"+membershipCode+"'";
                          connection.query(q2,function(err,rows){
                            if(err){
                              res.json({"message":"err.. error selecting discount"});
                            }else{
                              if(rows.length>0){
                                var discount = rows[0].discount;
                                //pending
                                var q3 = "select jumlah_bayar from `order` where no_bon = '"+no_bon+"'";
                                connection.query(q3,function(err,rows){
                                  if(err){
                                    res.json({"message":"err.. error on selecting jumlah Bayar"});
                                  }else{
                                    if(rows.length>0){
                                      var jumlahBayar = rows[0].jumlah_bayar;
                                      var afterDisc = jumlahBayar-(jumlahBayar*discount/100);
                                      var q4 = "update `order` set discount="+discount+",harga_bayar_fix="+afterDisc+",jumlah_bayar="+afterDisc+" where no_bon='"+no_bon+"'";
                                      connection.query(q4,function(err,rows){
                                        if(err){
                                          res.json({"message":"err.. error on updating"});
                                        }else{
                                          res.json({"message":"err.. success adding discount","priceAfterDiscount":afterDisc,"discount":discount});
                                        }
                                      });
                                    }else{
                                      res.json({"message":"Err.. no rows absbas","q3":q3});
                                    }
                                  }
                                });
                              }else{
                                res.json({"message":"err.. no rows","q2":q2});
                              }
                            }
                          });
                        }else{
                          res.json({"message":"err.. have already discounted"});
                        }
                      }else{
                        res.json({"message":"err.. no rows on order with given n_b"});
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

module.exports = discountMember;
