var express = require("express"),
	mysql = require("mysql"),
	bodyParser = require("body-parser"),
	md5 = require('MD5'),
  http = require('http');

var entryModel = require("./model/entry.js");
var nextCustomerModel = require("./model/counter/nextCustomer.js");
var loginModel = require("./model/login.js");
var queueByCategoryLookupModel = require("./model/counter/queueByCategoryLookup.js");
var displayModel = require("./model/display.js");
var recallModel = require("./model/counter/recall.js");
var checkIpModel = require("./model/checkIp.js");
var setAndGetTextModel = require("./model/admin/setAndGetText.js");
var createUserModel = require("./model/admin/createUser.js");
var editAccountModel = require("./model/admin/editAccount.js");
var testJsonModel = require("./model/testJson.js");
var deleteUserCounterModel = require("./model/admin/deleteUserCounter.js");
var getUsersModel = require("./model/getUsers.js");
var logoutModel = require("./model/logout.js");
var loginAdminModel = require("./model/admin/loginAdmin.js");
//material
var addNewMaterialModel = require("./model/admin/addNewMaterial.js");
var addStockModel = require("./model/storage-op/addStock.js");
var editMaterialModel = require("./model/admin/editMaterial.js");
var geMaterialDetailModel = require("./model/storage-op/getMaterialDetail.js");
var getMaterialsModel = require("./model/storage-op/getMaterials.js");

//product
var getAllProductsByCategoryModel = require("./model/admin/getAllProductsByCategory.js");
var getAvailableProductsModel = require("./model/counter/getAvailableProducts.js");
var addNewProductModel = require("./model/admin/addNewProduct.js");
var changeAvailabilityProductModel = require("./model/admin/changeAvailabilityProduct.js");
var addProductMaterialModel = require("./model/admin/addProductMaterial.js");
var getProductDetailModel = require("./model/admin/getProductDetail.js");

var createOrderModel = require("./model/counter/createOrder.js");
var addOrderItemModel = require("./model/counter/addOrderItem.js");
var getAllOrderItemModel = require("./model/cashier/getAllOrderItem.js");
var getAllOrdersModel = require("./model/cashier/getAllOrders.js");
var setOrderInfoModel = require("./model/counter/setOrderInfo.js");
var getOrderCustomerInfoModel = require("./model/counter/getOrderCustomerInfo.js");
var deleteItemOrderModel = require("./model/counter/deleteItemOrder.js");

//customer
var createCustomerNonMemberModel = require("./model/counter/createCustomerNonMember.js");
var getCustomersModel = require("./model/counter/getCustomers.js");
var registerMemberModel = require("./model/cashier/registerMember.js");
var discountMemberModel = require("./model/cashier/discountMember.js");

var getAllMemberTypeModel = require("./model/cashier/getAllMemberType.js");

var payModel = require("./model/cashier/pay.js");

//cron
var resetQueueNewDayModel = require("./model/cron/resetQueueNewDay.js");

var app = express();
var jwt = require("jsonwebtoken");
app.set('superSecret', 'ilovenode8');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

function connect(){
	var self = this;
	self.connectMysql(); //diisi dibawah ...
};

connect.prototype.connectMysql = function() {
	// body...
	var self = this;
    var pool      =    mysql.createPool({ //bisa pake create pool , bisa juga pake mySQL biasa, tapi lebih aman POOL..>>searching
        connectionLimit : 100,
        multipleStatements: true,

		//kalo mau coba local host
		host     : '127.0.0.1',
		user     : 'root',
		password : '',
		database : 'widji',
        datestring : true,
        debug    :  false//console
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);//configurasi otomatis dari express
        }
    });
}

connect.prototype.configureExpress = function(connection) {
	// body...
	var self = this;
	app.use(bodyParser.urlencoded({ extended: true,limit: '5mb' }));
	//mczal added test base64 raw
// 	app.use(function(req, res, next) {
//   req.rawBody = '';
//   req.setEncoding('utf8');
//
//   req.on('data', function(chunk) {
//     req.rawBody += chunk;
//   });
//
//   req.on('end', function() {
//     next();
//   });
// });
//EOF--mczal added test base64 raw
	app.use(bodyParser.json({limit: '5mb'}));

        // get an instance of the router for api routes
      var router = express.Router();
      // set /api
        router.post('/auth', function(req, res) {

           // if user is found and password is right
                // create a token
                var token = jwt.sign("user", app.get('superSecret'), {
                  expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                  success: true,
                  message: 'Enjoy your token!',
                  token: token
                });

        });

    // route middleware to verify a token
        router.use(function(req, res, next) {

          // check header or url parameters or post parameters for token
          var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.params.token;

          // decode token
          if (token) {

            // verifies secret and checks exp
            jwt.verify(token, app.get('superSecret'), function(err, decoded) {
              if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
              } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
              }
            });

          } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

          }
        });


      app.use('/radAPIeon', router);
			var entry = new entryModel (router,connection);
			var nextCustomer = new nextCustomerModel(router,connection);
			var login = new loginModel(router,connection,md5);
			var queueByCategoryLookup = new queueByCategoryLookupModel(router,connection);
			var display = new displayModel(router,connection);
			var recall = new recallModel(router,connection);
			var checkIp = new checkIpModel(router,connection);
			var setAndGetText = new setAndGetTextModel(router,connection,md5); //notdone
			var createUser = new createUserModel(router,connection,md5);
			var editAccount = new editAccountModel(router,connection,md5);
			var testJson = new testJsonModel(router,connection);
			var deleteUserCounter = new deleteUserCounterModel(router,connection,md5);
			var getUsers = new getUsersModel(router,connection,md5);
			var logout = new logoutModel(router,connection,md5);
			var loginAdmin = new loginAdminModel(router,connection,md5);
			//material
			var addNewMaterial = new addNewMaterialModel(router,connection);
			var addStock = new addStockModel(router,connection);
			var editMaterial = new editMaterialModel(router,connection);
			var geMaterialDetail = new geMaterialDetailModel(router,connection);
			var getMaterials = new getMaterialsModel(router,connection);

			var getAllProductsByCategory = new getAllProductsByCategoryModel(router,connection);
			var getAvailableProducts = new getAvailableProductsModel(router,connection);
			var addNewProduct = new addNewProductModel(router,connection);
			var changeAvailabilityProduct = new changeAvailabilityProductModel(router,connection);
			var addProductMaterial = new addProductMaterialModel(router,connection);
			var getProductDetail = new getProductDetailModel(router,connection);

			var createOrder = new createOrderModel(router,connection);
			var addOrderItem = new addOrderItemModel(router,connection);
			var getAllOrderItem = new getAllOrderItemModel(router,connection);
			var getAllOrders = new getAllOrdersModel(router,connection);
			var setOrderInfo = new setOrderInfoModel(router,connection);
			var getOrderCustomerInfo = new getOrderCustomerInfoModel(router,connection);
			var deleteItemOrder = new deleteItemOrderModel(router,connection);

			var registerMember = new registerMemberModel(router,connection);
			var createCustomerNonMember = new createCustomerNonMemberModel(router,connection);
			var getCustomers = new getCustomersModel(router,connection);
			var discountMember = new discountMemberModel(router,connection);

			var getAllMemberType = new getAllMemberTypeModel(router,connection);

			var pay = new payModel(router,connection);

			//cron
			var resetQueueNewDay = new resetQueueNewDayModel(router,connection);
      self.startServer();
};

connect.prototype.startServer = function() {
	// body...
	app.listen(3030,function(){
          console.log("magic \"widji\" happend");
      });
};

connect.prototype.stop = function(err) {
	// body...
	console.log("ISSUE WITH MYSQL \n"+ err);
	process.exit(1);
};

new connect();
