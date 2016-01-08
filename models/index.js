var config = require("../config").database;
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: "mysql"
});

var models = [{
	name: "Admin",
	file: "admin"
},{
	name: "Product",
	file: "product"
},{
	name: "Category",
	file: "category"
},{
	name: "User",
	file: "user"
},{
	name: "Order",
	file: "order"
},{
	name: "OrderPiece",
	file: "orderpiece"
},{
	name: "UserAddress",
	file: "useraddress"
}];

models.forEach(function(model) {
	module.exports[model.name] = sequelize.import(__dirname + '/' + model.file);
});

sequelize.authenticate().then(function(err){
	if(err) console.log(err);
	(function(model){
		model.Product.belongsTo(model.Category, {
			foreignKey: "CategoryID"
		});
		model.Order.belongsTo(model.UserAddress, {
			foreignKey: "UserAddressID"
		});
		model.Order.belongsTo(model.User, {
			foreignKey: "UserID",
			allowNull: true
		});
		model.OrderPiece.belongsTo(model.Order, {
			foreignKey: "OrderID"
		});
		model.OrderPiece.belongsTo(model.Product, {
			foreignKey: "ProductID",
		});
		model.UserAddress.belongsTo(model.User, {
			foreignKey: "UserID",
			allowNull: true
		});
		sequelize.sync({
			force: false
		}).then(function(){
			console.log("sync complete");
		}).catch(function(err){
			console.log(err);
		});
	})(module.exports);
}).catch(function(err){
	console.log(err);
});