var mysql = require('mysql');

function getCustomers(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

var self=this;

getCustomers.prototype.handleRoutes = function(router,connection){
  router.post('/getCustomers',function(err,rows){
    connection.query("select id,name,phone,email,membership_id,birthdate from `customer` ",function(err,rows){
      if(err){
        res.json({"message":"err.. error on selecting"});
      }else{
        if(rows.length>0){
          res.json({"message":"success","content":rows});
        }else{
          res.json({"message":"err.. no rows"});
        }
      }
    });
  });
}

module.exports = getCustomers;
