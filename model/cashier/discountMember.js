var mysql = require('mysql');

function discountMember(router,connection){
    var self=this;
    self.handleRoutes(router,connection);
}

discountMember.prototype.handleRoutes = function(router,connection){
  router.post('/discountMember',function(req,res){
    var sessionCode = req.body.sessionCode;
    var no_bon = req.body.sessionCode;
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
          //ambil jumlah discount dulu di membership code
          connection.query("select discount from `membership` where membership_code = '"+membershipCode+"'",function(err,rows){
            if(err){
              res.json({"message":"err.. error selecting discount"});
            }else{
              if(rows.length>0){
                var discount = rows[0].discount;
                //pending
                connection.query("update `order` set discount="+discount+" where no_bon='"+no_bon+"'",function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on updating"})
                  }else{
                    conection.query("select jumlah_bayar from `order` where no_bon = '"+no_bon+"'",function(err,rows){
                      if(err){
                        res.json({"message":"err.. error on selecting jumlah Bayar"});
                      }else{
                        if(rows.length>0){
                          var jumlahBayar = rows[0].jumlah_bayar;
                          var afterDisc = jumlahBayar*discount/100;
                          res.json({"message":"err.. success adding discount","priceAfterDiscount":afterDisc});
                        }else{
                          res.json({"message":"Err.. no rows"});
                        }
                      }
                    });
                  }
                });
              }else{
                res.json({"message":"err.. no rows"});
              }
            }
          });
        }
      }
    }
  });
}

module.exports = discountMember;
