function earningsReportDay(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

earningsReportDay.prototype.handleRoutes = function(router,connection){
  router.post('/earningsReportDay',function(req,res){
    var sessionCode = req.body.sessionCode;
    var tanggal = req.body.tanggal;
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;
    if(sessionCode == null || sessionCode == undefined || sessionCode == ''){
      res.json({"message":"err.. no param s_c received"});
    }else{
      if(tanggal == null || tanggal == undefined || tanggal == ''){
        res.json({"message":"err.. no param tgl received"});
      }else{
        if(bulan == null || bulan == undefined || bulan == ''){
          res.json({"message":"err.. no param bln received"});
        }else{
          if(tahun == null || tahun == undefined || tahun == ''){
            res.json({"message":"err.. no param thn received"});
          }else{
            tahun = tahun.substr(2,3);
            var cond_bon = tahun+""+bulan+""+tanggal;
            var q1 = "select id,no_bon,harga_bayar_fix-jumlah_bayar as paid,CASE  from `order` where no_bon like '"+cond_bon+"%' and jumlah_bayar <> harga_bayar_fix";
            connection.query(q1,function(err,rows){
              if(err){
                res.json({"message":"err.. error on selecting query"});
              }else{
                if(rows.length>0){
                  res.json({"message":"success","tanggal":tanggal+" "+bulan+" "+tahun,"content":rows});
                }else{
                  res.json({"message":"no transaction made this day","q":q1});
                }
              }
            });
          }
        }
      }
    }
  });
}

module.exports = earningsReportDay;
