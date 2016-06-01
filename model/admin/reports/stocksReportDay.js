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
            // tahun = tahun.substr(2,3);
            bulan = (bulan*1)+1;
            var dateNow = tahun+"-"+bulan+"-"+tanggal;
            var q1 = "CALL stocks_report('"+dateNow+"')";
            connection.query(q1,function(err,rows){
              if(err){
                res.json({"message":"err.. error on call stocks procedure","err":err,"q1":q1});
              }else{
                // res.json({"message":"success","q1":q1,"content":rows});
                var q2 = "select * from `used_material` where date(created_at) = '"+dateNow+"'";
                // var myDate = new Date();
                // var year = myDate.getFullYear();
                // var month = myDate.getMonth();
                // var date = myDate.getDate();
                // var hour = myDate.getHours();
                // var minute = myDate.getMinutes();
                // var q2 = "update `order` set updated_at = '"+year+"-"+month+"-"+date+" "+hour+":"+minute+"'";
                connection.query(q2,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on selectiong material used query","q1":q1,"q2":q2});
                  }else{
                    if(rows.length>0){
                      res.json({"message":"success","q1":q1,"q2":q2,"content":rows});
                    }else{
                      res.json({"message":"success : no used materials for today ; no rows","q1":q1,"q2":q2});
                    }

                  }
                });
              }
            });
          }
        }
      }
    }
  });
}

module.exports = stocksReportDay;
