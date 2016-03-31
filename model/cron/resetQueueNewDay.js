var mysql = require('mysql');

function resetQueueNewDay(router,connection){
  var self=this;
  self.handleRoutes(router,connection);
}

resetQueueNewDay.prototype.handleRoutes = function(router,connection){
  router.post('/resetQueueNewDay',function(req,res){
    /**
    * TODO : resetting all queue and saving order to history
    *
    * 1. Truncate `last_display_queue`  (q:TRUNCATE `last_display_queue`)
    * 2. set value = 0 `last_entry_cat_queue`
    * 3. set value = 0 `last_entry_counter_queue`
    * 4. Truncate `queue_rtn`  (q:TRUNCATE `queue_rtn`)
    */
    //
    var q1 = "TRUNCATE `last_display_queue`";
    var q2 = "update `last_entry_cat_queue` set value = 0";
    var q3 = "update `last_entry_counter_queue` set value = 0";
    var q4 = "TRUNCATE `queue_rtn`";
    connection.query(q1,function(err,rows){
      if(err){
        res.json({"message":"err.. error on q1","q1":q1});
      }else{
        connection.query(q2,function(err,rows){
          if(err){
            res.json({"message":"err.. error on q2","q2":q2});
          }else{
            connection.query(q3,function(err,rows){
              if(err){
                res.json({"message":"err.. error on q3","q3":q3});
              }else{
                connection.query(q4,function(err,rows){
                  if(err){
                    res.json({"message":"err.. error on q4","q4":q4});
                  }else{
                    res.json({"message":"success resetting the queue","goodbye":"see you tomorrow"});
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}

module.exports = resetQueueNewDay;
