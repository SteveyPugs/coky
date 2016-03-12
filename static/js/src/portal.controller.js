app.controller("Portal", function($scope, $http, $filter, $uibModal, Upload, $cookies){
	$scope.account = JSON.parse($cookies.get("Admin").substring($cookies.get("Admin").indexOf("{"), $cookies.get("Admin").lastIndexOf("}") + 1)).AdminID;
	$scope.init = function(){
		$http.get("/api/product").success(function(data){
			for(var item in data){
				for(var key in data[item]){
					if(key === "Category"){
						data[item]["CategoryName"] = data[item][key].CategoryName;
						delete data[item]["Category"];
					}
					if(key === "ProductStatus"){
						switch(data[item]["ProductStatus"]){
							case 1:
								data[item]["ProductStatus"] = "Draft";
								break;
							case 2:
								data[item]["ProductStatus"] = "Live";
								break;
						}
					}
				}	
			}
			$scope.products = data;
			$scope.safeproducts = data;
			$http.get("/api/category").success(function(data){
				$scope.categories = data;
				$scope.safecategories = data;
				$http.get("/api/order").success(function(data){
					for(var item in data){
						for(var key in data[item]){
							if(key === "OrderPaid"){
								switch(data[item]["OrderPaid"]){
									case false:
										data[item]["OrderStatus"] = "Refunded";
										break;
									case true:
										data[item]["OrderStatus"] = "Paid";
										break;
								}
							}
						}	
					}
					$scope.orders = data;
					$scope.safeorders = data;
					$http.get("/api/user").success(function(data){
						$scope.admins = data;
						$scope.safeadmins = data;
					}).error(function(err){
						console.log(err);
					});
				}).error(function(err){
					console.log(err);
				});
			}).error(function(err){
				console.log(err);
			});
		}).error(function(err){
			console.log(err);
		});
	}
	$scope.init();
	$scope.openProduct = function (size, title, productid) {
		$scope.productid = productid;
		$scope.title = title;
		var productModal = $uibModal.open({
			animation: true,
			templateUrl: "/modals/product.html",
			controller: function($scope, $uibModalInstance, title, productid, init){
				$scope.title = title;
				$scope.data = {};
				$scope.status = [{
					StatusID: 1,
					StatusName: "Draft"
				},{
					StatusID: 2,
					StatusName: "Live"
				}];
				if(title === "Edit"){
					$http.get("/api/product/" + productid).success(function(data){
						$scope.data.ProductName = data.ProductName;
						$scope.data.ProductPrice = data.ProductPrice;
						$scope.data.ProductStatus = data.ProductStatus;
						$scope.data.CategoryID = data.Category.CategoryID;
					}).error(function(err){
						console.log(err);
					});
				}
				$scope.cancel = function(){$uibModalInstance.dismiss("cancel")};
				$scope.ok = function(){
					switch(title){
						case "Add":
							Upload.upload({
								url: "/api/product",
								data: {
									"ProductImage": $scope.data.ProductImage,
									"ProductName": $scope.data.ProductName,
									"ProductPrice": $scope.data.ProductPrice,
									"ProductStatus": $scope.data.ProductStatus,
									"CategoryID": $scope.data.CategoryID,
								},
								method: "POST"
							}).then(function(res){
								$scope.data.ProductImage = "";
								$scope.data.ProductName = "";
								$scope.data.ProductPrice = "";
								$scope.data.ProductStatus = "";
								$scope.data.CategoryID = "";
								init();
								$uibModalInstance.close();
							}, function(err){
								console.log(err.status);
							});
							break;
						case "Edit":
							Upload.upload({
								url: "/api/product",
								data: {
									"ProductImage": $scope.data.ProductImage,
									"ProductName": $scope.data.ProductName,
									"ProductPrice": $scope.data.ProductPrice,
									"ProductStatus": $scope.data.ProductStatus,
									"CategoryID": $scope.data.CategoryID,
									"ProductID": productid
								},
								method: "PUT"
							}).then(function(res){
								$scope.data.ProductImage = "";
								$scope.data.ProductName = "";
								$scope.data.ProductPrice = "";
								$scope.data.ProductStatus = "";
								$scope.data.CategoryID = "";
								init();
								$uibModalInstance.close();
							}, function(err){
								console.log(err.status);
							});
							break;
					}
				};
			},
			size: size,
			resolve: {
				title: function(){
					return $scope.title;
				},
				productid: function(){
					return $scope.productid;
				},
				init: function(){
					return $scope.init;
				}
			}
		});
	};
	$scope.deleteProduct = function (size, productid) {
		$scope.productid = productid;
		var deleteConfirmtModal = $uibModal.open({
			animation: true,
			templateUrl: "/modals/confirm.html",
			controller: function($scope, $uibModalInstance, productid, init){
				$scope.cancel = function(){$uibModalInstance.dismiss("cancel")};
				$scope.ok = function(){
					$http.delete("/api/product/" + productid).success(function(data){
						init();
						$uibModalInstance.close();
					}).error(function(err){
						console.log(err);
					});
				};
			},
			size: size,
			resolve: {
				productid: function(){
					return $scope.productid;
				},
				init: function(){
					return $scope.init;
				}
			}
		});
	};
	$scope.openCategory = function (size) {
		var productModal = $uibModal.open({
			animation: true,
			templateUrl: "/modals/category.html",
			controller: function($scope, $uibModalInstance, init){
				$scope.data = {};
				$scope.cancel = function(){$uibModalInstance.dismiss("cancel")};
				$scope.ok = function(){
					$http.post("/api/category", {
						CategoryName: $scope.data.CategoryName
					}).success(function(data){
						init();
						$uibModalInstance.close();
					}).error(function(err){
						console.log(err);
					});
				};
			},
			size: size,
			resolve: {
				init: function(){
					return $scope.init;
				}
			}
		});
	};
	$scope.deleteCategory = function (size, categoryid) {
		$scope.categoryid = categoryid;
		var deleteConfirmtModal = $uibModal.open({
			animation: true,
			templateUrl: "/modals/confirm.html",
			controller: function($scope, $uibModalInstance, categoryid, init){
				$scope.cancel = function(){$uibModalInstance.dismiss("cancel")};
				$scope.ok = function(){
					$http.delete("/api/category/" + categoryid).success(function(data){
						init();
						$uibModalInstance.close();
					}).error(function(err){
						console.log(err);
					});
				};
			},
			size: size,
			resolve: {
				categoryid: function(){
					return $scope.categoryid;
				},
				init: function(){
					return $scope.init;
				}
			}
		});
	};
	$scope.saveShipping = function(guid, code) {
		if(code.length < 1) code = null;
		$http.put("/api/order",{
			OrderGUID: guid,
			OrderShipCode: code
		}).success(function(data){
			console.log("order updated");
		}).error(function(err){
			console.log(err);
		});
	};
	$scope.refundOrder = function (size, orderid) {
		$scope.orderid = orderid;
		var deleteConfirmtModal = $uibModal.open({
			animation: true,
			templateUrl: "/modals/confirm.html",
			controller: function($scope, $uibModalInstance, orderid, init){
				$scope.cancel = function(){$uibModalInstance.dismiss("cancel")};
				$scope.ok = function(){
					$http.get("/admin/order/" + orderid + "/refund").success(function(data){
						init();
						$uibModalInstance.close();
					}).error(function(err){
						console.log(err);
					});
				};
			},
			size: size,
			resolve: {
				orderid: function(){
					return $scope.orderid;
				},
				init: function(){
					return $scope.init;
				}
			}
		});
	};
	$scope.openAdmin = function (size) {
		var adminModal = $uibModal.open({
			animation: true,
			templateUrl: "/modals/admin.html",
			controller: function($scope, $uibModalInstance, init){
				$scope.data = {};
				$scope.cancel = function(){$uibModalInstance.dismiss("cancel")};
				$scope.ok = function(){
					$http.post("/api/admin", {
						AdminEmail: $scope.data.AdminEmail
					}).success(function(data){
						init();
						$uibModalInstance.close();
					}).error(function(err){
						console.log(err);
					});
				};
			},
			size: size,
			resolve: {
				init: function(){
					return $scope.init;
				}
			}
		});
	};
	$scope.deleteAdmin = function (size, adminid) {
		$scope.adminid = adminid;
		var deleteConfirmtModal = $uibModal.open({
			animation: true,
			templateUrl: "/modals/confirm.html",
			controller: function($scope, $uibModalInstance, adminid, init){
				$scope.cancel = function(){$uibModalInstance.dismiss("cancel")};
				$scope.ok = function(){
					$http.delete("/api/admin/" + adminid).success(function(data){
						init();
						$uibModalInstance.close();
					}).error(function(err){
						console.log(err);
					});
				};
			},
			size: size,
			resolve: {
				adminid: function(){
					return $scope.adminid;
				},
				init: function(){
					return $scope.init;
				}
			}
		});
	};
});