function stocksReportDay(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

stocksReportDay.prototype.handleRoutes = function(router,connection){
  router.post('/stocksReportDay',function(req,res){
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
            var q1 = "select ";
          }
        }
      }
    }
  });
}

module.exports = stocksReportDay;
