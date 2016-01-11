var express = require("express");
var cookieParser = require("cookie-parser");
var bcrypt = require("bcrypt");
var AWS = require("aws-sdk");
var Sequelize = require("sequelize");
var Chance = require("chance");
var chance = new Chance();
var multer  = require("multer");
var storage = multer.memoryStorage()
var upload = multer({
	storage: storage
});
var lodash  = require("lodash");
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport();
var mail_config = require("../config").mail;
var amazon_config = require("../config").amazon;
var stripe_config = require("../config").stripe;
AWS.config["accessKeyId"] = amazon_config.accessKeyId;
AWS.config["secretAccessKey"] = amazon_config.secretAccessKey;
var s3 = new AWS.S3();
var models = require("../models");
var router = express.Router();
var server_config = require("../config").server;
router.use(cookieParser("baKeShoP"));
var stripe = require("stripe")(stripe_config.sk);

/* Site Routes */
router.get("/", function(req, res){
	res.render("index");
});

router.get("/about", function(req, res){
	res.render("about");
});

router.get("/store", function(req, res){
	res.render("store");
});

router.get("/orders", function(req, res){
	if(req.cookies.User){
		models.Order.findAll({
			where:{
				UserID: req.cookies.User.UserID
			},
			order: "createdAt DESC"
		}).then(function(order){
			var orders = lodash.pluck(order, "dataValues");
			var orderids = lodash.pluck(orders, "OrderID");
			var useraddressids = lodash.pluck(orders, "UserAddressID");
			models.UserAddress.findAll({
				where: {
					UserAddressID: {
						$in: useraddressids
					}
				}
			}).then(function(addresses){
				models.OrderPiece.findAll({
					where: {
						OrderID: {
							$in: orderids
						}
					}
				}).then(function(pieces){
					var orderpieces = lodash.pluck(pieces, "dataValues");
					var addresspieces = lodash.pluck(addresses, "dataValues");
					for(var order in orders){
						orders[order].OrderPieces = lodash.filter(orderpieces, {
							OrderID: orders[order].OrderID
						});
						orders[order].OrderAddress = lodash.find(addresspieces, {
							UserAddressID: orders[order].UserAddressID
						});
					}
					res.render("order", {
						orders: orders
					});
				}).catch(function(err){
					res.send(err);
				});
			}).catch(function(err){
				res.send(err);
			});
		}).catch(function(err){
			res.send(err);
		});
	}
	else{
		res.redirect("/store");
	}
});

router.get("/profile", function(req, res){
	if(req.cookies.User){
		res.render("profile");
	}
	else{
		res.redirect("/store");
	}
});

router.get("/store/cart", function(req, res){
	res.render("cart");
});

router.get("/store/cart/shipping", function(req, res){
	res.render("shipping");
});

router.post("/store/cart/payment", function(req, res){
	res.render("payment", {
		orderAddress: req.body
	});
});

router.post("/store/cart/charge", function(req, res){
	var charge = stripe.charges.create({
		amount: req.body.total * 100,
		currency: "usd",
		source: req.body.token.id,
		receipt_email: "stephen.pugliese@outlook.com"
	}, function(err, charge) {
		if (err && err.type === 'StripeCardError'){
		}
		else{
			var UserID = null;
			var UserAddressUserID = null;
			if(req.cookies.User){
				UserID = req.cookies.User.UserID;
				if(req.body.address.Save === "Save"){
					UserAddressUserID = UserID;
				}
			}
			models.UserAddress.count({
				where: {
					UserID: UserID
				}
			}).then(function(count){
				var UserAddressDefault = false;
				if(UserID && count === 0){
					UserAddressDefault = true;
				}
				models.UserAddress.create({
					UserAddressFullName: req.body.address.UserAddressFullName,
					UserAddressStreet: req.body.address.UserAddressStreet,
					UserAddressCity: req.body.address.UserAddressCity,
					UserAddressState: req.body.address.UserAddressState,
					UserAddressZip: req.body.address.UserAddressZip,
					UserAddressDefault: UserAddressDefault,
					UserID: UserAddressUserID
				}).then(function(useraddress){
					models.Order.create({
						OrderPaid: true,
						OrderPaidConfirmation: charge.id,
						UserAddressID: useraddress.UserAddressID,
						OrderTotal: req.body.total,
						OrderTax: req.body.tax,
						OrderSubTotal: req.body.subtotal,
						OrderShipping: req.body.shipping,
						UserID: UserID
					}).then(function(order){
						var pieces = [];
						for(item in req.body.items){
							var single_row = {};
							single_row.OrderID = order.OrderID;
							single_row.OrderPieceQuantity = req.body.items[item].count;
							single_row.ProductID = parseInt(item);
							pieces.push(single_row);
						}
						models.OrderPiece.bulkCreate(pieces).then(function(){
						}).then(function(error){
							if(error) res.send(err);
							else res.send(order.OrderGUID);
						});
					}).catch(function(err){
						console.log(err);
						res.send(err);
					});
				}).catch(function(err){
					res.send(err);
				});
			}).catch(function(err){
				res.send(err);
			});
		}
	});
});

router.get("/store/cart/confirmation/:OrderGUID", function(req, res){
	models.Order.find({
		OrderGUID: req.params.OrderGUID
	}).then(function(order){
		stripe.charges.retrieve(order.OrderPaidConfirmation, function(err, charge){
			models.UserAddress.find({
				UserAddressID: order.UserAddressID
			}).then(function(address){
				models.OrderPiece.findAll({
					where: {
						OrderID: order.OrderID
					}
				}).then(function(pieces){
					res.render("confirmation",{
						confirmation: req.params.OrderGUID.toUpperCase(),
						address: address.dataValues,
						email: charge.receipt_email,
						totals: {
							subtotal: order.OrderSubTotal,
							total: order.OrderTotal,
							shipping: order.OrderShipping,
							tax: order.OrderTax
						},
						payment: {
							cardtype: charge.source.brand.toLowerCase(),
							last4: charge.source.last4
						},
						items: lodash.pluck(pieces, "dataValues")
					});
				}).catch(function(err){
					res.send(err);
				});
			}).catch(function(err){
				res.send(err);
			});
		});
	}).catch(function(err){
		res.send(err);
	});
});

router.get("/register", function(req, res){
	res.render("register-user");
});

router.post("/register", function(req, res){
	models.User.findOrCreate({
		where: {
			UserEmail: req.body.UserEmail,
			deletedAt: null
		},
		defaults: {
			UserPassword: bcrypt.hashSync(req.body.UserPassword, bcrypt.genSaltSync(10)),
			UserConfirmed: false,
			UserConfirmHash: bcrypt.hashSync("cookies", bcrypt.genSaltSync(10))
		}
	}).spread(function(user, created){
		if(created){
			transporter.sendMail({
				from: mail_config.from,
				to: req.body.UserEmail,
				subject: "Welcome to Tweedles Bakery!",
				html: "<a href='http://" + server_config.host + ":" + server_config.port +  "/confirm/" + user.UserID + "/" + user.UserConfirmHash + "'>Confirm Link</a>"
			}, function(error, info){
				if(error){
					return console.log(error);
				}
				res.redirect("/##complete");
			});
		}
		else{
			res.redirect("/register#invalid");
		}
	});
});

router.get("/confirm/:UserID/:Hash(*)", function(req, res){
	models.User.find({
		where:{
			UserID: req.params.UserID,
			UserConfirmHash: req.params.Hash,
			deletedAt: null
		}
	}).then(function(results){
		if(results){
			models.User.update({
				UserConfirmed: true
			},{
				where:{
					UserID: req.params.UserID,
					UserConfirmHash: req.params.Hash,
					deletedAt: null
				}
			}).then(function(updated){
				res.redirect("/##confirm");
			}).catch(function(err){
				res.send(err);
			});
		}
		else{
			res.redirect("/##noconfirm");
		}
	}).catch(function(err){
		res.send(err);
	});
});

router.post("/login", function(req, res){
	models.User.find({
		where: {
	 		UserEmail: req.body.UserEmail,
	 		deletedAt: null,
	 		UserConfirmed: true
 		}
 	}).then(function(user){
 		if(user){
	 		if(bcrypt.compareSync(req.body.UserPassword, user.UserPassword)){
	 			res.cookie("User", {
	 				UserID: user.UserID,
	 				UserEmail: user.UserEmail,
	 			}, {
	 				expires: new Date(Date.now() + 14400000)
	 			});
	 			res.send(true);
	 		}
	 		else{
	 			res.send(false);
	 		}
 		}
 		else{
 			res.send(false);
 		}
 	}).catch(function(err){
 		res.send(err);
 	});
});

router.get("/logout", function(req, res){
	res.clearCookie("User");
	res.redirect(req.header("Referer"));
});
/* Site Routes */

/* API Routes */
router.get("/api/category", function(req, res){
	models.Category.findAll({
		where:{
			deletedAt: null
		}
	}).then(function(results){
		res.send(results);
	}).catch(function(err){
		res.send(err);
	});
});

router.get("/api/product", function(req, res){
	models.Product.findAll({
		where:{
			deletedAt: null
		},
		attributes: ["ProductID", "ProductName", "ProductPrice",  "ProductImage", "ProductImageType", "ProductActive"],
		include: [{
			model: models.Category,
			where: {
				CategoryID: Sequelize.col("Product.CategoryID")
			}
		}]
	}).then(function(products){
		res.send(products);
	}).catch(function(err){
		res.send(err);
	});
});

router.get("/api/address/:UserID", function(req, res){
	models.UserAddress.findAll({
		where: {
			UserID: req.params.UserID
		}
	}).then(function(addresses){
		res.send(lodash.pluck(addresses, "dataValues"));
	}).catch(function(err){
		res.send(err);
	});
});

router.post("/api/product", upload.single("ProductImage"), function(req, res){
	var fileGUID = chance.guid();
	s3.putObject({
		Bucket: amazon_config.Bucket,
		Key: fileGUID,
		ACL: "public-read",
		Body: req.file.buffer
	}, function(err, data){
		if(err) res.send(err);
		else{
			models.Product.create({
				ProductName: req.body.ProductName,
				ProductPrice: req.body.ProductPrice,
				ProductImage: fileGUID,
				ProductImageType: req.file.mimetype,
				ProductActive: req.body.ProductActive,
				CategoryID: req.body.CategoryID,
			}).then(function(results){
				res.send(results);
			}).catch(function(err){
				res.send(err);
			});
		}
	});
});

router.post("/api/category", function(req, res){
	models.Category.create({
		CategoryName: req.body.CategoryName
	}).then(function(results){
		res.send(results);
	}).catch(function(err){
		res.send(err);
	});
});

router.post("/api/address", function(req, res){
	models.UserAddress.update({
		UserAddressDefault: false
	},{
		where:{
			UserID: req.body.UserID,
			deletedAt: null
		}
	}).then(function(updated){
		models.UserAddress.update({
			UserAddressDefault: true
		},{
			where:{
				UserID: req.body.UserID,
				UserAddressID: req.body.UserAddressID,
			}
		}).then(function(updated){
			res.send("success");
		}).catch(function(err){
			res.send(err);
		});
	}).catch(function(err){
		res.send(err);
	});
});
/* API Routes */

/* Administration Routes */
router.get("/admin/login", function(req, res){
	res.render("admin");
});

router.post("/admin/login", function(req, res){
	models.Admin.find({
 		AdminEmail: req.body.AdminEmail,
 		deletedAt: null
 	}).then(function(admin){
 		if(bcrypt.compareSync(req.body.AdminPassword, admin.AdminPassword)){
 			res.cookie("Admin", admin);
 			res.redirect("/admin");
 		}
 		else{
 			res.redirect("/admin/login#invalid");
 		}
 	}).catch(function(err){
 		res.send(err);
 	});
});

router.get("/admin/logout", function(req, res){
	res.clearCookie("Admin");
	res.redirect("/admin");
});

router.get("/admin/register", function(req, res){
	res.render("register-admin");
});

router.post("/admin/register", function(req, res){
 	models.Admin.create({
 		AdminEmail: req.body.AdminEmail,
 		AdminPassword: bcrypt.hashSync(req.body.AdminPassword, bcrypt.genSaltSync(10))
 	}).then(function(results){
 		res.send("success");
 	}).catch(function(err){
 		res.send(err);
 	});
});

router.get("/admin", function(req, res){
	if(req.cookies.Admin){
		res.render("portal");
	}
	else{
		res.redirect("/admin/login");
	}
});
/* Administration Routes */

module.exports = router;